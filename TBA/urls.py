from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    path('check/login', views.check_login, name='check_login'),
    path('upload/profile/pic', views.upload_profile_pic, name='upload_profile_pic'),
    path('send/profile/comment/<int:profile_id>', views.send_profile_comment, name='send_profile_comment'),
    path('profile/comment/<int:profile_id>', views.get_profile_comments, name='get_profile_comments'),
    path('profile/messages', views.get_all_messages, name='get_messages'),
    path('profile/messages/user', views.get_all_users, name='user_messages'),
    path('profile/messages/conversation/<int:user_id>', views.get_message_history, name='message_history'),
    
    path('send/profile/message/<int:recipient_id>', views.send_message, name='send_message'),
    
    path('entries/get/all', views.get_all_entries, name='all_entries'),
    path('entries/<str:entry_type>/<int:entry_id>', views.get_single_entry, name='get_single_entry'),


    
    path('search', views.search, name='search'),
    path('user/data/<int:user_id>', views.get_user_data, name='get_user_data')

]