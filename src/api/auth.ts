export async function login(email: string, password: string): Promise<{ access_token: string }> {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
  
    const res = await fetch("http://localhost:8000/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });
  
    if (!res.ok) {
      throw new Error("Login failed");
    }
  
    return await res.json();
  }