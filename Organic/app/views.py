from django.shortcuts import render

# Create your views here.


def home(request):
    return render(request, 'app/home.html')

def cart(request):
    return render(request, 'app/cart.html')

def aboutus(request):
    return render(request, 'app/aboutus.html')

def auth(request):
    return render(request, 'app/auth.html')

def blog(request):
    return render(request, 'app/blog.html')

def productlist(request):
    return render(request, 'app/productlist.html')

def productdetail(request):
    return render(request, 'app/productdetail.html')


def wishlist(request):
    return render(request, 'app/wishlist.html')

def success(request):
    return render(request, 'app/success.html')


def policy(request):
    return render(request, 'app/policy.html')

def contact(request):
    return render(request, 'app/contact.html')

def checkout(request):
    return render(request, 'app/checkout.html')

def orderdetail(request):
    return render(request, 'app/orderdetail.html')




