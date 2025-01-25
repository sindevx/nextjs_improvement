// utils/api.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
        throw new Error('No access token found');
    }

    const { headers: customHeaders, ...restOptions } = options;

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        ...(customHeaders || {})
    });

    console.log('Request URL:', url);
    console.log('Request Headers:', Object.fromEntries(headers.entries()));
    console.log('Request Options:', restOptions);

    const response = await fetch(url, {
        ...restOptions,
        headers
    });

    // ล็อก response details
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    // Clone response เพื่อให้สามารถอ่าน body ได้หลายครั้ง
    const clonedResponse = response.clone();

    try {
        const responseBody = await clonedResponse.text();
        console.log('Response Body:', responseBody);
    } catch (error) {
        console.log('Failed to read response body:', error);
    }

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}