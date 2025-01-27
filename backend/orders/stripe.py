# orders/stripe.py
import stripe
from django.conf import settings

# Initialize Stripe with the secret key from settings
stripe.api_key = settings.STRIPE_SECRET_KEY


def get_or_create_stripe_product_and_price(
    product_name, product_description, price, product_url, product_image_url=None
):
    """
    Gets or creates a Stripe product and associated price.

    Args:
        product_name (str): Name of the product.
        product_description (str): Description of the product.
        price (float): Product price in dollars.
        product_image_url (str, optional): URL for the product image.

    Returns:
        tuple: Stripe product and price objects.
    """
    try:
        # Check if the product already exists
        existing_products = stripe.Product.list(limit=100, active=True)
        product = next(
            (prod for prod in existing_products.data if prod.name == product_name), None
        )
        print(product_image_url)

        if not product:
            # Create the product if it doesn't exist
            product_data = {
                "name": product_name,
                "description": product_description,
                "url": product_url,
            }
            if product_image_url:
                product_data["images"] = [product_image_url]

            product = stripe.Product.create(**product_data)

        # Check if a matching price exists
        price_in_cents = int(price * 100)  # Convert to cents
        existing_prices = stripe.Price.list(product=product.id, active=True)
        stripe_price = next(
            (
                p
                for p in existing_prices.data
                if p.unit_amount == price_in_cents and p.currency == "usd"
            ),
            None,
        )

        if not stripe_price:
            # Create a price if it doesn't exist
            stripe_price = stripe.Price.create(
                product=product.id,
                unit_amount=price_in_cents,
                currency="eur",
            )

        return product, stripe_price
    except stripe.error.StripeError as e:
        # Log the error for debugging
        print(
            f"Stripe error occurred: {e.user_message if hasattr(e, 'user_message') else str(e)}"
        )

        # Optionally, wrap the error and raise it
        raise Exception("Failed to interact with Stripe API") from e


def create_stripe_products_from_order(order):
    """
    Creates Stripe products and prices for each item in an order.

    Args:
        order (Order): The order instance containing items.

    Returns:
        list: Stripe line items for creating a Checkout Session.
    """
    line_items = []

    for item in order.items.all():
        product_name = item.product.name
        product_description = item.product.description or "No description available"
        product_price = item.product.discounted_price()
        quantity = item.quantity
        product_image_url = (
            f"{settings.SITE_URL}{item.product.gallery.first().image.url}"
            if item.product.gallery.exists()
            else None
        )
        product_url = f"{settings.FRONTEND_SITE_URL}/products/{item.product.slug}"

        try:
            # Create or retrieve the Stripe product and price
            product, stripe_price = get_or_create_stripe_product_and_price(
                product_name=product_name,
                product_description=product_description,
                price=product_price,
                product_url=product_url,
                product_image_url=product_image_url,
            )

            # Append the line item for the Checkout Session
            line_items.append({"price": stripe_price.id, "quantity": quantity})
        except Exception as e:
            # Log error and skip adding this item to the line items
            print(f"Error creating Stripe product/price for {product_name}: {e}")
            continue

    return line_items


def get_or_create_stripe_customer(user):
    """
    Retrieves or creates a Stripe customer for the given user.

    Args:
        user (User): The user instance.

    Returns:
        str: Stripe customer ID.
    """
    if user.stripe_customer_id:
        # Return the existing customer ID if available
        return user.stripe_customer_id

    # Create a new customer on Stripe
    customer = stripe.Customer.create(
        email=user.email,
        name=f"{user.first_name} {user.last_name}",
    )

    # Save the Stripe customer ID to the user model
    user.stripe_customer_id = customer["id"]
    user.save()

    return customer["id"]
