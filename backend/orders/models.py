from django.db import models
from users.models import User
from products.models import Product


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),  # Order placed but not yet processed
        ("confirmed", "Confirmed"),  # Order confirmed and payment successful
        ("processing", "Processing"),  # Order is being prepared
        (
            "ready_for_shipping",
            "Ready for Shipping",
        ),  # Order packed and ready for shipment
        ("shipped", "Shipped"),  # Order shipped to the customer
        ("out_for_delivery", "Out for Delivery"),  # Order with the delivery agent
        ("delivered", "Delivered"),  # Order successfully delivered to the customer
        ("canceled", "Canceled"),  # Order canceled by the user or admin
        ("returned", "Returned"),  # Order returned by the customer
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    address = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    order_notes = models.TextField(blank=True, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_total_price(self):
        """
        Calculate the total price of the order based on its items.
        """
        total = sum(
            item.product.discounted_price() * item.quantity for item in self.items.all()
        )
        self.total_price = total
        self.save()

    def __str__(self):
        return f"Order #{self.id} by {self.user.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        """
        Override the save method to recalculate the order's total price.
        """
        super().save(*args, **kwargs)
        self.order.calculate_total_price()

    def delete(self, *args, **kwargs):
        """
        Override the delete method to recalculate the order's total price after an item is removed.
        """
        super().delete(*args, **kwargs)
        self.order.calculate_total_price()

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Order #{self.order.id})"
