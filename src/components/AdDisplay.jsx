import React, {useState, useEffect} from "react";

function AdDisplay() { 

    //setting up state for adData

    const [adData, setAdData] = useState([]);

    //fetching the data from the backend and setting it to the state variable for adData

    useEffect(() => {
        fetch("http://localhost:3000/fakeDataSet")
        .then(response => response.json())
        .then(data => 
            setAdData(data))
        .catch(error => console.error("Error fetching data:", error))
       
    },[])

    //writing a keymap to aid in transforming all key names in the data to "canonical" names

    const keyMap = {
        campaign_name: "campaign",
        campaign: "campaign",
        utm_campaign: "campaign",
        media_buy_name: "media_buy",
        ad_group: "media_buy",
        ad_squad_name: "media_buy",
        utm_medium: "media_buy",
        ad_name: "creative",
        image_name: "creative",
        creative_name: "creative",
        utm_content: "creative",
        spend: "spend",
        cost: "spend",
        clicks: "clicks",
        post_clicks: "clicks"
}

//Writing a function to use the keymap to transform "old keys" into canonical keys and return the cleaned data.

    function standardizeNames(adArray, keyMap) {
        
        return adArray.map(item => {
            const newItem = {}
            for (const oldKey in item) {
                const newKey = keyMap[oldKey] || oldKey;
                newItem[newKey] = item[oldKey];
            }
            return newItem;
        })

    }

    //first I have to extract each platform's array of data from the larger data set and set it to a var i.e "facebook_ads"
    //Then I have to call the standardizeNames function on each ad within platform array.
    //Then I have to take the arrays and "flatten" them into one array.
    //I will then be able to map over this array with a foreach() (?) and display the correct properties in the JSX

    const facebook_ads = adData["facebook_ads"]
    const twitter_ads = adData["twitter_ads"]
    const snapchat_ads = adData["snapchat_ads"]
    const google_ads = adData["google_analytics"]

    const s_facebook_ads = facebook_ads.map(ad => standardizeNames(ad, keyMap))
    const s_twitter_ads = twitter_ads.map(ad => standardizeNames(ad, keyMap))
    const s_snapchat_ads = snapchat_ads.map(ad => standardizeNames(ad, keyMap))
    const s_google_ads = google_ads.map(ad => standardizeNames(ad, keyMap))

    console.log("original facebook ad:", facebook_ads[0])
    console.log("standardized facebook ad:", s_facebook_ads[0])

return (
    <div>
        <h1>Ad Data</h1>
    </div>
)

}

export default AdDisplay;

