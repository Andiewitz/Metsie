from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """User profile data associated with an account."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=150, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    role = models.CharField(max_length=100, blank=True, default="")
    is_onboarded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.username}"


@receiver(post_save, sender=User)
def create_or_save_user_profile(sender, instance, created, **kwargs):
    """Automatically create a UserProfile whenever a User is created."""
    if created:
        UserProfile.objects.create(user=instance)
    else:
        if hasattr(instance, "profile"):
            instance.profile.save()
