export interface DemoUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
}

class DemoAuth {
  private currentUser: DemoUser | null = null
  private listeners: ((user: DemoUser | null) => void)[] = []

  // Simulate Firebase auth methods
  async signInWithEmailAndPassword(email: string, password: string): Promise<{ user: DemoUser }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation
    if (!email || !password) {
      throw new Error("auth/invalid-email")
    }

    if (password.length < 6) {
      throw new Error("auth/wrong-password")
    }

    const user: DemoUser = {
      uid: "demo-user-" + Date.now(),
      email,
      displayName: email.split("@")[0],
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    }

    this.currentUser = user
    this.notifyListeners(user)

    return { user }
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: DemoUser }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (!email || !password) {
      throw new Error("auth/invalid-email")
    }

    if (password.length < 6) {
      throw new Error("auth/weak-password")
    }

    const user: DemoUser = {
      uid: "demo-user-" + Date.now(),
      email,
      displayName: email.split("@")[0],
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    }

    this.currentUser = user
    this.notifyListeners(user)

    return { user }
  }

  async signInWithPopup(): Promise<{ user: DemoUser }> {
    // Simulate Google sign-in
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user: DemoUser = {
      uid: "demo-google-user-" + Date.now(),
      email: "demo@google.com",
      displayName: "Demo Google User",
      photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
    }

    this.currentUser = user
    this.notifyListeners(user)

    return { user }
  }

  async signOut(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    this.currentUser = null
    this.notifyListeners(null)
  }

  async updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates }
      this.notifyListeners(this.currentUser)
    }
  }

  onAuthStateChanged(callback: (user: DemoUser | null) => void): () => void {
    this.listeners.push(callback)
    // Immediately call with current user
    callback(this.currentUser)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  private notifyListeners(user: DemoUser | null) {
    this.listeners.forEach((listener) => listener(user))
  }

  getCurrentUser(): DemoUser | null {
    return this.currentUser
  }
}

export const demoAuth = new DemoAuth()
