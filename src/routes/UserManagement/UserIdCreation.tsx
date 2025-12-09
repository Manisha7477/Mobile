import HorizontalLabelForm from "@/components/forms/HorizontalLabelForm"
import Loading from "@/navigation/Loading"
import { formatDateOnly } from "@/utils/convert"
import { USER_CREATION_FORM_DATA } from "@/utils/data"
import { useQuery } from "@/utils/dom"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import { IUser, IFormVariable } from "@/utils/types"
import { FormikValues, FormikHelpers } from "formik"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/api/axiosInstance"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom";
import ManageUserTopHeader from "./ManageUserTopHeader"
interface IUserIdCreationProps {
  user: IUser | null
}

const UserIdCreation: React.FunctionComponent<IUserIdCreationProps> = ({
  user,
}) => {
  const navigate = useNavigate()
  const query = useQuery()
  const id = query.get("id")
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false)
  const [updateDataById, setUpdateDataById] = useState<{
    [key: string]: any
  } | null>(null)

  const storedUser = localStorage.getItem('userData');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const username = parsedUser?.username;

  const [formData, setFormData] = useState<IFormVariable[]>(USER_CREATION_FORM_DATA)
  const { userId } = useParams();
  const isEditMode = !!userId;
  const mapApiToForm = (data: any) => ({
    username: data.username || "",
    email: data.email || "",
    station_id: data.stationId || "",
    role_id: data.roleId || "",
    first_name: data.firstName || "",
    last_name: data.lastName || "",
    contact_phone: data.contactPhone || "",
    created_by: username || "",
    role_name: data.roleName || "",
    station_name: data.stationName || "",
  });

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      try {
        // Fetch stations
        const stationsRes = await api.get(`/api/stationsDD`)
        console.log("stations", stationsRes.data)

        // Fetch roles
        const rolesRes = await api.get(`/roles/`)
        console.log("roles", rolesRes.data)

        // Transform stations data
        const stationsOptions = stationsRes.data.map((station: any) => ({
          value: station.station_id,
          label: station.station_name,
        }))

        // Transform roles data
        const rolesOptions = rolesRes.data.map((role: any) => ({
          value: role.role_id,
          label: role.role_name,
        }))

        // Update form data with fetched options
        const updatedFormData = USER_CREATION_FORM_DATA.map((field) => {
          if (field.name === "station_id") {
            return {
              ...field,
              options: stationsOptions
            }
          }
          if (field.name === "role_id") {
            return {
              ...field,
              options: rolesOptions
            }
          }
          return field
        })

        setFormData(updatedFormData)
        console.log("Updated form data:", updatedFormData)
      } catch (error) {
        console.error("Error fetching dropdown options:", error)
        toast.error("Failed to load dropdown options", {
          autoClose: 2000,
        })
      }
    }

    fetchDropdownOptions()
  }, [])

 const filteredFormData = formData.filter((field) => {
  if (field.name === "created_by") {
    return false; // hide from form
  }
  return id ? field.showInUpdate !== false : true;
});

  // const initialDefaultValueData = initialFormikValues(USER_CREATION_FORM_DATA)
  const initialDefaultValueData = {
    ...initialFormikValues(formData),
    created_by: username || "",
  };

  const formValidationSchemaData = formValidationSchema(filteredFormData)

  useEffect(() => {
    const fetchUserById = async () => {
      if (!isEditMode) return;
      setLoading(true);
      try {
        const res = await api.get(`/User/get/${userId}`);
        if (res.data?.data) {
          const mapped = mapApiToForm(res.data.data); // map API to form
          setUpdateDataById(mapped);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, [userId]);

  const updateData = updateDataById || {}

  const formatDateTypeUpdate =
    updateData !== undefined
      ? updateData.validFrom && updateData.validTo
        ? {
          validFrom: formatDateOnly(updateData.validFrom),
          validTo: formatDateOnly(updateData.validTo),
        }
        : {}
      : {}

  const initialDefaultData =
    Object.assign({}, updateData, formatDateTypeUpdate) ||
    initialDefaultValueData

  const handleCancelForm = () => {
    navigate("/user-management/manage-user")
  }


  const handleSubmitForm = async (
    values: FormikValues,
    actions: FormikHelpers<FormikValues>
  ) => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        if (val !== undefined && val !== null) fd.append(key, val as string);
      });

      if (isEditMode) {
        fd.append("userId", userId!);
        await api.put(`/User/update/${userId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("User updated successfully!");
      } else {
        await api.post("/User/createUser", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("User created successfully!");
      }

      navigate("/user-management/manage-user");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error("Error: " + message);
    } finally {
      setLoading(false);
      actions.setSubmitting(false);
    }
  };


  return (
    <div className=" ">
      <ManageUserTopHeader
        title={userId ? "Update Existing User" : "Create New User"}
        subTitle="Fill the form below to create or update user"
        onAddClick={() => navigate("/user-management/manage-user/user-creation")}
        showAddButton={false}
      />
      <div className="sm:border rounded border-base-300">
        <div className=" mt-5 px-4 py-2 screen-height-media">
          {loading && <Loading />}
          <HorizontalLabelForm
            enableReinitialize={true} // reinitializes when updateDataById is loaded
            formVariables={filteredFormData}
            initialDefaultValueData={updateDataById || initialDefaultValueData}
            formValidationSchemaData={formValidationSchemaData}
            handleSubmitForm={handleSubmitForm}
            handleCancelForm={handleCancelForm}
          />
        </div>
      </div>
    </div>
  )
}

export default UserIdCreation