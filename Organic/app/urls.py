from django.urls import path
from . import views

# Register your URL patterns here.
urlpatterns = [
    path('', views.home, name='home'),
    path('cart/', views.cart, name='cart'),
    path('aboutus/', views.aboutus, name='aboutus'),
    path('auth/', views.auth, name='auth'),
    path('blog/', views.blog, name='blog'),
    path('productlist/', views.productlist, name='productlist'),
    path('productdetail/', views.productdetail, name='productdetail'),
    path('wishlist/', views.wishlist, name='wishlist'),
    path('success/', views.success, name='success'),
    path('policy/', views.policy, name='policy'),
    path('contact/', views.contact, name='contact'),
    path('checkout/', views.checkout, name='checkout'),
    path('orderdetail/', views.orderdetail, name='orderdetail'),
]