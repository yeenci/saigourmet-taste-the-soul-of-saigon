# API Checklist


## **Auth APIs**

### **POST /auth/login**

* [X] Login

### **POST /auth/request-otp**

* [X] Request OTP

### **POST /auth/verify-otp**

* [X] Verify OTP

### **POST /auth/reset-password**

* [X] Reset Password

---

## **User APIs**

### **POST /user/register**

* [X] Register

### **PUT /user/update**

* [X] Update User

### **GET /user/me**

* [X] Get User Info

### **GET /user/booking**

* [X] Get User Bookings

### **POST /user/booking**

* [X] Post User Bookings

### **GET /user/booking/{booking_id}**

* [X] Get Booking Detail

### **PUT /user/booking/{booking_id}**

* [X] Put Booking

### **DELETE /user/booking/{booking_id}**

* [X] Delete Booking

---

## **Restaurant APIs**

### **GET /restaurant/**

* [X] List Restaurants

### **GET /restaurant/{restaurant_id}**

* [ ] Get Restaurant Detail

---

## **Article APIs**

### **GET /article/**

* [X] List Articles

### **GET /article/{article_id}**

* [X] Get Article Detail

---


## **Admin APIs**

### **GET /admin/restaurant/{restaurant_id}/booking**

* [ ] Get All Bookings for Restaurant

### **POST /admin/booking/{booking_id}/accept**

* [ ] Accept Booking

### **POST /admin/booking/{booking_id}/reject**

* [ ] Reject Booking

### **POST /admin/restaurant/create**

* [ ] Create Restaurant (Admin)

### **PUT /admin/restaurant/{restaurant_id}**

* [ ] Update Restaurant (Admin)

### **DELETE /admin/restaurant/{restaurant_id}**

* [ ] Delete Restaurant (Admin)