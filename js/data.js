/**
 * data.js - Supabase Sync Version
 * Handles data loading and saving using Supabase as a backend.
 */

const SUPABASE_URL = 'https://epzgzyytcszsfsaxemnj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7bEHJexUgEb5gE2Zf1HmLw_AL94bRIt';

let productsData = [];
let appConfig = {
    appName: "Burger Lab",
    primaryColor: "#FF512F",
    secondaryColor: "#DD2476",
    logoBase64: ""
};

/**
 * Loads data from Supabase
 */
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
            console.log("Data loaded from Supabase successfully");
        } else {
            console.log("No data found in Supabase, using defaults");
            // If empty, we might want to save the default data once
            await saveDataToServer();
        }
        return { items: productsData, config: appConfig };
    } catch (error) {
        console.error("Error loading data:", error);
        return { items: productsData, config: appConfig };
    }
}

/**
 * Saves current state to Supabase
 */
async function saveDataToServer() {
    const dataToSave = {
        config: appConfig,
        items: productsData
    };

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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save data: ${errorText}`);
        }

        console.log("Data saved to Supabase successfully");
        return true;
    } catch (error) {
        console.error("Error saving data:", error);
        return false;
    }
}
