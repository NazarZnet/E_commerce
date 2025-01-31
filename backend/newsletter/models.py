from django.db import models
from tinymce.models import HTMLField


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email


# Create your models here.
class Newsletter(models.Model):
    subject = models.CharField(max_length=255)
    message = HTMLField()
    created_at = models.DateTimeField(auto_now_add=True)

    def send_newsletter(self):
        """
        Sends an email to all subscribers.
        """
        from django.core.mail import send_mail
        from django.template.loader import render_to_string
        from django.conf import settings

        subscribers = Subscriber.objects.values_list("email", flat=True)

        if not subscribers:
            return "No subscribers found."

        email_html = render_to_string(
            "email/newsletter.html", {"message": self.message}
        )

        send_mail(
            subject=self.subject,
            message="Your email client does not support HTML emails.",
            logo_url=f"{settings.SITE_URL}/static/logo.png",
            html_message=email_html,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=subscribers,
            fail_silently=False,
        )

    def save(self, *args, **kwargs):
        """
        Override save method to send emails when a new newsletter is created.
        """
        super().save(*args, **kwargs)
        self.send_newsletter()

    def __str__(self):
        return self.subject
