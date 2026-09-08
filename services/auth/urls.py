from django.urls import re_path

from .account_setup import AccountSetupView
from .views import CurrentUserView, LoginView, LogoutView, RegisterView

urlpatterns = [
    re_path(r"^register/?$", RegisterView.as_view(), name="auth_register"),
    re_path(r"^login/?$", LoginView.as_view(), name="auth_login"),
    re_path(r"^logout/?$", LogoutView.as_view(), name="auth_logout"),
    re_path(r"^me/?$", CurrentUserView.as_view(), name="auth_me"),
    re_path(r"^account-setup/?$", AccountSetupView.as_view(), name="account_setup"),
]
