from django.urls import path

from .account_setup import AccountSetupView
from .views import CurrentUserView, LoginView, LogoutView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth_register"),
    path("login/", LoginView.as_view(), name="auth_login"),
    path("logout/", LogoutView.as_view(), name="auth_logout"),
    path("me/", CurrentUserView.as_view(), name="auth_me"),
    path("account-setup/", AccountSetupView.as_view(), name="account_setup"),
]
