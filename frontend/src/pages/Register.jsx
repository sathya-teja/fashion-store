export default function Register() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form className="flex flex-col space-y-4">
        <input type="text" placeholder="Name" className="p-2 border rounded" />
        <input type="email" placeholder="Email" className="p-2 border rounded" />
        <input type="password" placeholder="Password" className="p-2 border rounded" />
        <button className="bg-gray-900 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
