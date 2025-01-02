import os
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import ProductGallery, Product


@receiver(post_delete, sender=ProductGallery)
def delete_gallery_image_and_empty_folder(sender, instance, **kwargs):
    """
    Delete the image file when a ProductGallery instance is deleted and remove the folder if it's empty.
    """
    if instance.image:
        image_path = instance.image.path
        if os.path.isfile(image_path):
            os.remove(image_path)

        # Check if the folder is empty after deleting the image
        folder_path = os.path.dirname(image_path)
        if not os.listdir(folder_path):  # If the folder is empty
            os.rmdir(folder_path)  # Remove the empty folder


@receiver(post_delete, sender=Product)
def delete_product_gallery_images(sender, instance, **kwargs):
    """
    Delete all associated gallery images and their folder when a Product is deleted.
    """
    for gallery_image in instance.gallery.all():
        if gallery_image.image and os.path.isfile(gallery_image.image.path):
            os.remove(gallery_image.image.path)

    # Delete the folder for the product if it exists
    product_folder_path = os.path.join('media/product_gallery', instance.slug)
    if os.path.isdir(product_folder_path):
        for root, dirs, files in os.walk(product_folder_path):
            for file in files:
                os.remove(os.path.join(root, file))
        os.rmdir(product_folder_path)  # Remove the folder