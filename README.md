# 📱 Mobile Review API

The **Mobile Review API** is a RESTful backend service built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.  
It powers a social platform for users to review movies and shows, interact through comments and likes, and share multimedia posts.  
The application is deployed on **AWS EC2** with full load balancing, secure networking, and DNS management using AWS services.

---

## 🚀 Features

### 👤 User Management
- User registration, login, and password reset
- Profile update functionality

### 🎬 Movies & Shows
- View latest movies and shows
- Write reviews for movies and shows
- Like other users' reviews
- Comment on reviews and reply to comments
- Like comments on reviews
- Share specific review details, movie details, and show details

### 📸 Feed / Social Posts
- Create photo or video posts in the feed
- Like feed posts
- Comment on feed posts and reply to comments
- Like comments on feed posts

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Deployment:** AWS EC2, Nginx (load balancing), AWS Load Balancer, AWS Route53  
- **Security:** AWS Security Groups, AWS Certificate Manager (SSL/TLS)

---

## 🌐 AWS Infrastructure

- Deployed on **EC2 instances**
- **Nginx** configured for load balancing
- **Security Group** set up for firewall rules
- **Target Group + Load Balancer** for distributing traffic
- **Route53 Hosted Zone** with A records for DNS
- **AWS Certificate Manager** for HTTPS
- Load balancer integrated with Route53

---

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/ajayvishwakarma457/mobile-review-api.git
cd mobile-review-api

# Install dependencies
npm install

# Setup your environment variables (.env)
# Example:
# DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
# JWT_SECRET=your_jwt_secret
# AWS_ACCESS_KEY=your_access_key
# AWS_SECRET_KEY=your_secret_key
# (etc.)

# Run the app
npm run start


Author: Ajay M Vishwakarma
GitHub: @ajayvishwakarma457  
Email: ajayvishwakarma457@gmail.com

📄 License
  This repository is licensed under the MIT License.
  See the LICENSE file for details.
