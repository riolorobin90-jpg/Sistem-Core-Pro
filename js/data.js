/**
 * data.js - Supabase Sync Version
 */
const SUPABASE_URL = 'https://epzgzyytcszsfsaxemnj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwemd6eXl0Y3N6c2ZzYXhlbW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxMzQyNDIsImV4cCI6MjAyOTcxMDI0Mn0.N6U-Hjc0MDgxeNn0.5rbKhco2A1O9aumcWWkg5abJYErJjZbm5oNsR2qi8UU';

let productsData = [];
let appConfig = {
        appName: "Burger Lab",
        primaryColor: "#FF512F",
        secondaryColor: "#DD2476",
        logoBase64: ""
};

async function loadDataFromServer() {
        try {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/app_store?id=eq.1&select=data`, {
                                    method: 'GET',
                                    headers: {
                                                        'apikey': SUPABASE_KEY,
                                                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                                                        'Content-Type': 'application/json'
                                    }
                    });
                    if (!response.ok) throw new Error('Failed to load data from Supabase');
                    const result = await response.json();
                    if (result && result.length > 0 && result[0].data && Object.keys(result[0].data).length > 0) {
                                    const serverData = result[0].data;
                                    productsData = serverData.items || [];
                                    appConfig = serverData.config || appConfig;
                    }
                    return { items: productsData, config: appConfig };
        } catch (error) {
                    console.error("Error loading data:", error);
                    return { items: productsData, config: appConfig };
        }
}

async function saveDataToServer() {
        const dataToSave = { config: appConfig, items: productsData };
        try {
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/app_store?id=eq.1`, {
                                    method: 'PATCH',
                                    headers: {
                                                        'apikey': SUPABASE_KEY,
                                                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                                                        'Content-Type': 'application/json',
                                                        'Prefer': 'return=minimal'
                                    },
                                    body: JSON.stringify({ data: dataToSave })
                    });
                    if (!response.ok) throw new Error('Failed to save data');
                    return true;
        } catch (error) {
                    console.error("Error saving data:", error);
                    return false;
        }
}
