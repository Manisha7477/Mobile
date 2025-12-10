import { useState, useEffect } from "react"
import { IUser } from "@/utils/types"
import { Field, Formik, Form } from "formik"
import * as Yup from "yup"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

interface IProfileProps {
  user: IUser | null
}

const Profile: React.FunctionComponent<IProfileProps> = ({ user }) => {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [tempAvatar, setTempAvatar] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    const savedAvatar = sessionStorage.getItem("avatar")
    if (savedAvatar) setAvatar(savedAvatar)
  }, [])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setTempAvatar(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveAvatar = () => {
    if (tempAvatar) {
      setAvatar(tempAvatar)
      sessionStorage.setItem("avatar", tempAvatar)
      setTempAvatar(null)
    }
  }

  const handleCancelAvatar = () => setTempAvatar(null)
  const handleDeleteAvatar = () => {
    setAvatar(null)
    setTempAvatar(null)
    sessionStorage.removeItem("avatar")
  }

  const passwordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
      .min(6, "Password should be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  })

  const handleSubmit = (values: any) => {
    console.log("Changing password with:", values)
  }

  const storedUser = localStorage.getItem('userData');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?.userId;

  return (
    <div className="max-w-6xl mx-auto mt-2 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar */}
        <div className="bg-white rounded-2xl shadow-lg p-3 flex flex-col items-center">
          <div className="relative group 
        w-28 h-28 
        sm:w-32 sm:h-32 
        md:w-36 md:h-36 
        lg:w-40 lg:h-40">
            {(tempAvatar || avatar) ? (
              <img
                src={tempAvatar || avatar || ""}
                alt="avatar"
                className="w-full h-full rounded-full object-cover shadow-xl border-4 border-primary/20 transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-2xl sm:text-5xl font-bold shadow-xl">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            {tempAvatar && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 rounded-full">
                <button className="btn btn-xs btn-success">Save</button>
                <button className="btn btn-xs btn-error">Cancel</button>
              </div>
            )}
          </div>
          {/* Avatar Upload */}
          <div className="mt-4 w-full">
            <input type="file" accept="image/*" id="avatarUpload" className="hidden" onChange={handleAvatarChange} />
            <label htmlFor="avatarUpload" className="btn btn-outline btn-sm w-full text-sm">
              Change Photo
            </label>
            {avatar && (
              <button className="btn btn-outline btn-warning btn-sm w-full mt-2 text-sm" onClick={handleDeleteAvatar}>
                Delete Photo
              </button>
            )}
          </div>
        </div>
        {/* Right Column - Profile Info */}
        <div className="md:col-span-1 lg:col-span-2 space-y-2">
          <div className="bg-white rounded-2xl shadow-lg p-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-3">
              Profile Information
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="text-lg text-gray-900">
                  {user?.username}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-lg text-gray-900">{user?.emailAddress}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 -mt-3">Role</dt>
                <dd className="text-lg text-gray-900">{user?.roleName}</dd>
              </div>
              {/* <div>
                <dt className="text-sm font-medium text-gray-500">
                  Contact Number
                </dt>
                <dd className="text-lg text-gray-900">{user?.contactNumber}</dd>
              </div> */}
            </dl>
          </div>
          {/* Change Password */}
          <div className="bg-white rounded-2xl shadow-lg p-1">
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              {/* <button className="btn text-white btn-primary w-full sm:w-auto">
                {isChangingPassword ? "Cancel" : "Change Password"}
              </button> */}
              <button
                className="btn text-white bg-primary w-full sm:w-auto"
                onClick={() => navigate(`/user-management/manage-user/edit-profile/${userId}`)}
              >
                Edit Profile
              </button>
            </div>
            <AnimatePresence>
              {isChangingPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Formik
                    initialValues={{
                      oldPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }}
                    validationSchema={passwordSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched }) => (
                      <Form className="bg-gray-50 p-2 rounded-xl shadow-inner">
                        <h3 className="text-xl font-semibold mb-4">
                          Update Password
                        </h3>
                        {/* Old Password */}
                        <div className="mb-4">
                          <label
                            htmlFor="oldPassword"
                            className="block font-medium text-gray-700"
                          >
                            Old Password
                          </label>
                          <Field
                            name="oldPassword"
                            type="password"
                            className="input input-bordered w-full mt-2"
                          />
                          {errors.oldPassword && touched.oldPassword && (
                            <p className="text-error text-sm mt-1">
                              {errors.oldPassword}
                            </p>
                          )}
                        </div>
                        {/* New Password */}
                        <div className="mb-4">
                          <label
                            htmlFor="newPassword"
                            className="block font-medium text-gray-700"
                          >
                            New Password
                          </label>
                          <Field
                            name="newPassword"
                            type="password"
                            className="input input-bordered w-full mt-2"
                          />
                          {errors.newPassword && touched.newPassword && (
                            <p className="text-error text-sm mt-1">
                              {errors.newPassword}
                            </p>
                          )}
                        </div>
                        {/* Confirm Password */}
                        <div className="mb-4">
                          <label
                            htmlFor="confirmPassword"
                            className="block font-medium text-gray-700"
                          >
                            Confirm Password
                          </label>
                          <Field
                            name="confirmPassword"
                            type="password"
                            className="input input-bordered w-full mt-2"
                          />
                          {errors.confirmPassword &&
                            touched.confirmPassword && (
                              <p className="text-error text-sm mt-1">
                                {errors.confirmPassword}
                              </p>
                            )}
                        </div>
                        <div className="flex justify-end">
                          <button type="submit" className="btn btn-primary">
                            Save Changes
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
