import { userLogout } from "@/actions/auth";
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"


const AdminDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await userLogout();
    navigate("/login");
  }

  return (
    <div>
      AdminDashboard

      <Button
         variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-200 cursor-pointer"
            onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  )
}

export default AdminDashboard