from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    path('check/login', views.check_login, name='check_login'),
    path('upload/profile/pic', views.upload_profile_pic, name='upload_profile_pic'),

]