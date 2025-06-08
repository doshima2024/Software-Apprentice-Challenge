import React, {useState, useEffect} from "react";

function AdDisplay() { 

    //setting up state for adData

    const [adData, setAdData] = useState([]);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")

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

      if (!adData || Object.keys(adData).length === 0) {
     return <div>Loading...</div>;
     }
 

    //first I have to extract each platform's array of data from the larger data set and set it to a var i.e "facebook_ads"

    const facebook_ads = adData["facebook_ads"]
    const twitter_ads = adData["twitter_ads"]
    const snapchat_ads = adData["snapchat_ads"]
    const google_ads = adData["google_analytics"]

    //Then I have to call the standardizeNames function on each ad within platform array.

    const s_facebook_ads = standardizeNames(facebook_ads, keyMap)
    const s_twitter_ads = standardizeNames(twitter_ads, keyMap)
    const s_snapchat_ads = standardizeNames(snapchat_ads, keyMap)
    const s_google_ads = standardizeNames(google_ads, keyMap)

    //I need a function to merge the Google Analytics "results" data into each corresponding ad object.
    
    function mergeGAResults(adArray, gaArray) {
        return adArray.map(ad => {
            const match = gaArray.find(gaObject =>
            gaObject["campaign"] === ad["campaign"] &&
            gaObject["creative"] === ad["creative"]
            )
            return {
                ...ad,
                results: match ? match.results : "N/A"
            }
        })
    }

    //Then I have to call the mergeGAResults function to generate the new data, which includes the "results" from Google Analytics:

    const s_facebook_ads_results = mergeGAResults(s_facebook_ads, s_google_ads)
    const s_twitter_ads_results = mergeGAResults(s_twitter_ads, s_google_ads)
    const s_snapchat_ads_results = mergeGAResults(s_snapchat_ads, s_google_ads)

    //Then I have to take the arrays and consolidate them into one array.

    const allAds = [
        ...s_facebook_ads_results,
        ...s_twitter_ads_results,
        ...s_snapchat_ads_results,
    ] 

    // I have to write a function to sort ads in ascending or descending order, or leave as is, depending on the value of the sortOrder state variable

    const getSortedAds = (ads) => {
        if (sortOrder === "asc"){
            return [...ads].sort((a,b) => a.spend - b.spend)
        } else if (sortOrder === "desc") {
            return [...ads].sort((a,b) => b.spend - a.spend)
        } else {
            return ads;
        }
    }

    // I need to create a variable to hold sorted ads (the result of running getSortedAds on allAds)

    const filteredAds = getSortedAds(allAds).filter((ad) =>
    ad.campaign.toLowerCase().includes(searchTerm.toLowerCase()));


return (
    <div>
        <h1>Ad Data</h1>
        <div className="flex flex-col space-y-2 mb-4">
            <button onClick={() => setSortOrder("asc")} className="bg-blue-500 text-white rounded">Sort By Spend Asc</button>
            <button onClick={() => setSortOrder("desc")} className="bg-blue-500 text-white rounded">Sort By Spend Desc</button>
            <button onClick={() => setSortOrder(null)} className="bg-blue-500 text-white rounded">Reset</button>
        </div>
        <div>
            <h3>Search for Campaign by Name</h3>
            <form>
                <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}>
                </input>
            </form>
        </div>
        {filteredAds.map((ad, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 w-full sm:w-[300px]" >
            <h1>Campaign: {ad.campaign}</h1>
            <p>Media Buy: {ad.media_buy}</p>
            <p>Creative: {ad.creative}</p>
            <p>Spend: {ad.spend}</p>
            <p>Clicks: {ad.clicks}</p>
            <p>Results: {ad.results}</p>
            </div>
        ))}
        
    </div>
)

}

export default AdDisplay;

