# Microservices Architecture Project

A Node.js-based microservices application demonstrating containerized services with Docker, MongoDB, and RabbitMQ message queue integration.

## 🏗️ Architecture Overview

This project consists of three microservices:

- **User Service** (Port 3001): Manages user data and operations
- **Task Service** (Port 3002): Handles task management with message queue integration
- **Notification Service** (Port 3003): Consumes messages from RabbitMQ for notifications

## 🛠️ Tech Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js
- **Database**: MongoDB
- **Message Queue**: RabbitMQ
- **Containerization**: Docker & Docker Compose
- **ODM**: Mongoose

## 📦 Services

### User Service
- **Port**: 3001
- **Database**: MongoDB (userdb)
- **Endpoints**:
  - `POST /users` - Create a new user
  - `GET /getUsers` - Retrieve all users
  - `GET /` - Health check endpoint

### Task Service
- **Port**: 3002
- **Database**: MongoDB (userdb)
- **Message Queue**: RabbitMQ (task_queue)
- **Endpoints**:
  - `POST /tasks` - Create a new task and send notification message
  - `GET /getTasks` - Retrieve all tasks
  - `GET /` - Health check endpoint

### Notification Service
- **Port**: 3003
- **Message Queue**: RabbitMQ (task_queue consumer)
- **Function**: Listens for task creation messages and processes notifications

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Microservices
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Verify services are running**
   - User Service: http://localhost:3001
   - Task Service: http://localhost:3002
   - Notification Service: http://localhost:3003
   - RabbitMQ Management: http://localhost:15672 (guest/guest)
   - MongoDB: localhost:27017

## 📡 API Usage

### Create a User
```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Get All Users
```bash
curl http://localhost:3001/getUsers
```

### Create a Task
```bash
curl -X POST http://localhost:3002/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Sample Task", "description": "Task description", "userId": "USER_ID_HERE"}'
```

### Get All Tasks
```bash
curl http://localhost:3002/getTasks
```

## 🔄 Message Flow

1. When a task is created via `POST /tasks`, the Task Service:
   - Saves the task to MongoDB
   - Publishes a message to RabbitMQ (`task_queue`)
   - Returns the created task

2. The Notification Service:
   - Consumes messages from the `task_queue`
   - Processes notifications (currently logs the message)

## 🐳 Docker Configuration

### Services in Docker Compose:
- **MongoDB**: Community server with persistent volume
- **RabbitMQ**: With management plugin enabled
- **User Service**: Built from local Dockerfile
- **Task Service**: Built from local Dockerfile  
- **Notification Service**: Built from local Dockerfile

### Ports:
- MongoDB: 27017
- RabbitMQ: 5672 (AMQP), 15672 (Management UI)
- User Service: 3001
- Task Service: 3002
- Notification Service: 3003

## 🔧 Development

### Running Individual Services (Development Mode)

1. **Install dependencies for each service**
   ```bash
   cd user-service && npm install
   cd ../task-service && npm install
   cd ../notification-service && npm install
   ```

2. **Start MongoDB and RabbitMQ**
   ```bash
   docker-compose up mongo rabbitmq
   ```

3. **Run services individually**
   ```bash
   # Terminal 1
   cd user-service && npm start
   
   # Terminal 2  
   cd task-service && npm start
   
   # Terminal 3
   cd notification-service && npm start
   ```

## 🔍 Monitoring

- **RabbitMQ Management UI**: http://localhost:15672
  - Username: `guest`
  - Password: `guest`
  - Monitor queues, exchanges, and message flow

- **MongoDB**: Connect using any MongoDB client to `mongodb://localhost:27017`

## 🚦 Health Checks

Each service provides a basic health check endpoint at `/` that returns sample data to verify the service is running.

## 📝 Data Models

### User Schema
```javascript
{
  name: String,
  email: String
}
```

### Task Schema
```javascript
{
  title: String,
  description: String,
  userId: ObjectId,
  createdAt: Date (default: now)
}
```

## 🛡️ Error Handling

- **Connection Retry Logic**: Services implement retry mechanisms for RabbitMQ connections
- **Graceful Degradation**: Task Service returns 503 if RabbitMQ is unavailable
- **Database Error Handling**: Proper error responses for MongoDB operations

## 🔮 Future Enhancements

- [ ] Add authentication and authorization
- [ ] Implement comprehensive logging
- [ ] Add unit and integration tests
- [ ] Include API documentation (Swagger/OpenAPI)
- [ ] Add health check endpoints
- [ ] Implement service discovery
- [ ] Add monitoring and metrics collection
- [ ] Database migrations and seeding
- [ ] Environment-specific configurations

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Note**: This is a development setup. For production deployment, consider implementing proper security measures, environment configurations, and monitoring solutions.