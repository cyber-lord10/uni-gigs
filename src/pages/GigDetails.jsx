import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  addDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { DollarSign, Clock, MapPin, User, ArrowLeft } from "lucide-react";
import { createNotification } from "../services/notifications";

export default function GigDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    async function fetchGigAndApplication() {
      try {
        const docRef = doc(db, "gigs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const gigData = { id: docSnap.id, ...docSnap.data() };
          setGig(gigData);

          if (currentUser) {
            // Check if user has applied
            const q = query(
              collection(db, "applications"),
              where("gigId", "==", id),
              where("applicantId", "==", currentUser.uid),
            );
            const appSnap = await getDocs(q);
            if (!appSnap.empty) {
              setHasApplied(true);
            }

            // If poster, fetch all applicants
            if (currentUser.uid === gigData.posterId) {
              const appsQuery = query(
                collection(db, "applications"),
                where("gigId", "==", id),
              );
              const appsSnap = await getDocs(appsQuery);
              setApplicants(
                appsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
              );
            }
          }
        } else {
          console.log("No such document!");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching gig:", error);
      }
      setLoading(false);
    }

    fetchGigAndApplication();
  }, [id, currentUser, navigate]);

  async function handleApply() {
    if (!currentUser) return;
    setApplying(true);
    try {
      await addDoc(collection(db, "applications"), {
        gigId: id,
        applicantId: currentUser.uid,
        applicantName: currentUser.displayName,
        applicantEmail: currentUser.email,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setHasApplied(true);
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to apply");
    }
    setApplying(false);
  }

  async function handleUpdateStatus(appId, newStatus) {
    try {
      // Update application status
      // Note: In a real app, you'd use a batch or transaction to close the gig if accepted
      const appRef = doc(db, "applications", appId);
      await setDoc(appRef, { status: newStatus }, { merge: true });

      // Update local state
      setApplicants((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app,
        ),
      );

      // Send notification to applicant
      const applicant = applicants.find((a) => a.id === appId);
      if (applicant) {
        await createNotification(
          applicant.applicantId,
          `Application Update: ${gig.title}`,
          `Your application has been ${newStatus}.`,
          newStatus === "accepted" ? "success" : "error",
          `/gigs/${id}`,
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  }

  if (loading)
    return (
      <div className="text-center py-xl text-muted">Loading details...</div>
    );
  if (!gig) return null;

  const isPoster = currentUser?.uid === gig.posterId;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline mb-md text-sm gap-xs"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card mb-lg">
        <div className="flex justify-between items-start mb-lg">
          <h1 className="text-2xl font-bold">{gig.title}</h1>
          <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-md py-sm rounded-lg text-xl font-bold flex items-center gap-xs">
            <DollarSign size={20} />
            {gig.payment}
          </span>
        </div>

        <div className="flex flex-wrap gap-lg mb-lg text-muted border-b border-[var(--color-border)] pb-lg">
          <div className="flex items-center gap-sm">
            <User size={18} />
            <span>
              Posted by{" "}
              <span className="text-[var(--color-text-main)]">
                {gig.posterName}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <MapPin size={18} />
            <span>{gig.university}</span>
          </div>
          <div className="flex items-center gap-sm">
            <Clock size={18} />
            <span>{gig.createdAt?.toDate().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="prose text-[var(--color-text-main)] mb-xl whitespace-pre-wrap">
          {gig.description}
        </div>

        <div className="flex justify-end">
          {isPoster ? (
            <button className="btn btn-outline" disabled>
              You posted this gig
            </button>
          ) : hasApplied ? (
            <button className="btn btn-success" disabled>
              Application Sent
            </button>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className="btn btn-primary px-xl"
            >
              {applying ? "Sending..." : "Apply for Gig"}
            </button>
          )}
        </div>
      </div>

      {isPoster && applicants.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold mb-md">
            Applicants ({applicants.length})
          </h2>
          <div className="grid gap-md">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="card flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{app.applicantName}</h3>
                  <p className="text-sm text-muted">{app.applicantEmail}</p>
                </div>
                <div className="flex items-center gap-sm">
                  {app.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(app.id, "accepted")}
                        className="btn btn-primary text-sm bg-green-600 hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, "rejected")}
                        className="btn btn-outline text-sm text-red-500 border-red-500 hover:bg-red-500/10"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`px-md py-xs rounded text-sm font-bold ${
                        app.status === "accepted"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {app.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
