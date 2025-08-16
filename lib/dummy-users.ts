// Dummy users for testing different roles and functionality
export const dummyUsers = {
  admin: {
    email: "admin@markethub.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  customer: {
    email: "customer@example.com",
    password: "customer123",
    name: "John Customer",
    role: "customer",
  },
  seller: {
    email: "seller@example.com",
    password: "seller123",
    name: "Jane Seller",
    role: "seller",
    storeId: "tech-innovations-hub",
    storeName: "Tech Innovations Hub",
  },
}

// Function to login with dummy users
export const loginWithDummyUser = (userType: keyof typeof dummyUsers) => {
  const user = dummyUsers[userType]
  localStorage.setItem("user", JSON.stringify(user))
  return user
}
