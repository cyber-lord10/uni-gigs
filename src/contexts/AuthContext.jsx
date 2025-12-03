import { createContext, useContext, useEffect, useState } from 'react';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	async function signup(email, password, displayName) {
		// University Email Validation
		if (!email.endsWith('.edu')) {
			throw new Error('Please use a valid university email address (.edu)');
		}

		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;

		// Create user document in Firestore
		await setDoc(doc(db, 'users', user.uid), {
			uid: user.uid,
			email: user.email,
			displayName: displayName,
			university: email.split('@')[1], // Simple extraction
			createdAt: new Date(),
		});

		return user;
	}

	function login(email, password) {
		return signInWithEmailAndPassword(auth, email, password);
	}

	async function signInWithSocial(provider) {
		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			console.log('Social Sign In Success:', user.uid, user.email);

			// Check if user exists in Firestore, if not create them
			const docRef = doc(db, 'users', user.uid);
			const docSnap = await getDoc(docRef);

			if (!docSnap.exists()) {
				const email = user.email || `no-email-${user.uid}@example.com`; // Fallback if email is missing
				const university =
					email.includes('@') ? email.split('@')[1] : 'External';

				await setDoc(docRef, {
					uid: user.uid,
					email: email,
					displayName: user.displayName || 'Anonymous',
					university: university,
					photoURL: user.photoURL,
					createdAt: new Date(),
				});
			}

			return user;
		} catch (error) {
			console.error('Social auth error:', error);
			throw error;
		}
	}

	function logout() {
		return signOut(auth);
	}

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				// Fetch additional user data if needed
				const docRef = doc(db, 'users', user.uid);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					setCurrentUser({ ...user, ...docSnap.data() });
				} else {
					setCurrentUser(user);
				}
			} else {
				setCurrentUser(null);
			}
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		signup,
		login,
		signInWithSocial,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
