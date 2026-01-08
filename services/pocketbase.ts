import PocketBase from 'pocketbase';
import { Subscription, User } from '../types';

// Initialize the PocketBase client
export const pb = new PocketBase('https://selavbase.srinikb.in');

// Authentication
export const loginWithGoogle = async () => {
    try {
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' });
        // Verify login was successful
        if (!pb.authStore.isValid) {
            throw new Error("Authentication failed: Store invalid after login");
        }
        return authData;
    } catch (error) {
        console.error("PocketBase Login Error:", error);
        throw error;
    }
};

export const logout = () => {
    pb.authStore.clear();
};

export const getCurrentUser = () => {
    return pb.authStore.model as unknown as User | null;
};

export const isAuthenticated = () => {
    return pb.authStore.isValid;
};

// User Operations
export const updateUser = async (id: string, data: Partial<User>) => {
    return await pb.collection('users').update(id, data);
};

export const deleteUser = async (id: string) => {
    return await pb.collection('users').delete(id);
};

// Subscription Operations
export const getSubscriptions = async (userId: string) => {
    return await pb.collection('subscriptions').getFullList({
        filter: `user = "${userId}"`,
        sort: '-created'
    });
};

export const createSubscription = async (data: any) => {
    // Ensure user ID is attached
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error("User not authenticated");
    
    return await pb.collection('subscriptions').create({
        ...data,
        user: userId
    });
};

export const updateSubscription = async (id: string, data: any) => {
    return await pb.collection('subscriptions').update(id, data);
};

export const deleteSubscription = async (id: string) => {
    return await pb.collection('subscriptions').delete(id);
};