export const dummyUsers = {
  admin: {
    email: "admin@stylehub.com",
    password: "admin123",
    name: "StyleHub Admin",
    role: "admin",
  },
  customer1: {
    email: "customer@example.com",
    password: "customer123",
    name: "Emma Johnson",
    role: "customer",
  },
  customer2: {
    email: "john@example.com",
    password: "customer123",
    name: "John Smith",
    role: "customer",
  },
  customer3: {
    email: "sarah@example.com",
    password: "customer123",
    name: "Sarah Wilson",
    role: "customer",
  },
}

// Function to login with dummy users
export const loginWithDummyUser = (userType: keyof typeof dummyUsers) => {
  const user = dummyUsers[userType]
  localStorage.setItem("user", JSON.stringify(user))
  return user
}
