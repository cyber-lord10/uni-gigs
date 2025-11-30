import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { db, storage } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Camera, Save, Loader } from "lucide-react";

export default function EditProfile() {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    major: "",
    university: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || "",
        bio: currentUser.bio || "",
        major: currentUser.major || "",
        university: currentUser.university || "",
      });
      setPhotoPreview(currentUser.photoURL);
    }
  }, [currentUser]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let photoURL = currentUser.photoURL;

      if (photoFile) {
        const storageRef = ref(storage, `profile_photos/${currentUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Auth Profile
      await updateProfile(currentUser, {
        displayName: formData.displayName,
        photoURL: photoURL,
      });

      // Update Firestore Document
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        bio: formData.bio,
        major: formData.major,
        photoURL: photoURL,
      });

      addToast("Profile updated successfully!", "success");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      addToast("Failed to update profile. " + error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-lg">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="card">
        {/* Photo Upload */}
        <div className="flex flex-col items-center mb-xl">
          <div className="relative w-32 h-32 mb-md">
            <img
              src={
                photoPreview ||
                `https://ui-avatars.com/api/?name=${formData.displayName}`
              }
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-[var(--color-bg)] shadow-lg"
            />
            <label className="absolute bottom-0 right-0 bg-[var(--color-primary)] text-white p-2 rounded-full cursor-pointer hover:bg-[var(--color-primary-hover)] transition-colors shadow-md">
              <Camera size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-muted">
            Click the camera icon to change photo
          </p>
        </div>

        <div className="grid gap-md">
          <div>
            <label className="label">Display Name</label>
            <input
              type="text"
              className="input"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="label">University (Read-only)</label>
            <input
              type="text"
              className="input opacity-50 cursor-not-allowed"
              value={formData.university}
              readOnly
            />
          </div>

          <div>
            <label className="label">Major / Field of Study</label>
            <input
              type="text"
              className="input"
              value={formData.major}
              onChange={(e) =>
                setFormData({ ...formData, major: e.target.value })
              }
              placeholder="e.g. Computer Science"
            />
          </div>

          <div>
            <label className="label">Bio</label>
            <textarea
              className="input min-h-[100px]"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell us a bit about yourself..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-md mt-xl">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="btn btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={20} className="mr-sm" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
