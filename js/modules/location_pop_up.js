import createHTMLElement from "./html_generator.js";
import { detectCurrentLocation, getSearchLocations } from "./location_api.js";
import {
    addFavoriteLocation,
    getFavoriteLocations,
    getLatestLocations,
    removeFavoriteLocation,
    storeActiveLocation
} from "./location_storage.js";
import showWeatherData from "./view.js";

// Save all of the relevant elements in jQuery objects
const $popUpButton = $("#location-tab");
const $searchInput = $("#location-search-input");
const $popUp = $("#location-pop-up");
const $locationsList = $("#locations-list");
const $latestButton = $("#latest-locations");
const $favoriteButton = $("#favorite-locations");
const $currentLocationButton = $("#current-location-button");

// Create some variables used for the search mechanic
const SEARCH_DELAY = 400;
let searchTimeout;

// Show the correct locations when the users searches
const searchHandler = () => {
    // Restart the search timeout everytime the user types so the locations don't update for each keystroke
    clearInterval(searchTimeout);
    searchTimeout = setTimeout(async () => {
        // If the search box is empty than show the latest locations, otherwise show the search locations
        const searchBoxIsEmpty = $searchInput.val() === "";
        const locations = searchBoxIsEmpty
            ? getLatestLocations()
            : await getSearchLocations($searchInput.val());
        createLocationItems(locations);
        // If the search box is empty then activate the "latest button", else deactivate the "latest" and "favorite" buttons
        if (searchBoxIsEmpty) setActiveButton($latestButton);
        else setActiveButton();
    }, SEARCH_DELAY);
};
$searchInput.on("input", searchHandler);
$searchInput.on("focus", searchHandler);

// Show the latest locations when the "latest button" is pressed
$latestButton.on("click", () => {
    createLocationItems(getLatestLocations());
    setActiveButton($latestButton);
});

// Show the favorite locations when the "favorite button" is pressed
$favoriteButton.on("click", () => {
    createLocationItems(getFavoriteLocations(), true);
    setActiveButton($favoriteButton);
});

// Handle open and close of the pop-up
document.addEventListener("click", e => {
    const popUpIsOpen = $popUp.prop("open");
    // If you press the pop-up button when the pop-up is closed, then open it
    if (e.target === $popUpButton.get(0) && !popUpIsOpen) openLocationsPopUp();
    // Else if you press outside the pop-up when it is open, then close it
    else if (!e.composedPath().includes($popUp.get(0)) && popUpIsOpen) closeLocationsPopUp();
});

// Show the current location when the current location button is pressed
$currentLocationButton.on("click", async () => {
    try {
        const location = await detectCurrentLocation();
        showWeatherData(location);
        storeActiveLocation(location);
        updateLocationButtonText(location.name);
        closeLocationsPopUp();
    } catch {
        alert("You must allow the browser to access your location...");
    }
});

export function updateLocationButtonText(locationName) {
    $popUpButton.text(locationName);
}

// Reset the active class on the "latest" and "favorite" buttons and add it to the input button
function setActiveButton($button = null) {
    // Remove the active class on the "latest" and "favorite" buttons
    $latestButton.removeClass("active");
    $favoriteButton.removeClass("active");

    if ($button != null) {
        $button.addClass("active");
    }
}

function openLocationsPopUp() {
    $searchInput.val("");
    $popUp.get(0).show();
    createLocationItems(getLatestLocations());
    setActiveButton($latestButton);
}

function closeLocationsPopUp() {
    $popUp.get(0).close();
    $popUp.attr("closing", true);
    $popUp.on("animationend", () => $popUp.removeAttr("closing"));
}

// Clear the location buttons
function clearLocationItems() {
    $locationsList.empty();
}

// Generate new location buttons based on the locations parameter
async function createLocationItems(locations, displaysFavorites = false) {
    clearLocationItems();

    locations.forEach(location => {
        const element = createHTMLElement("li", {
            children: [
                createHTMLElement("button", {
                    classList: "change-location-button",
                    textContent: location.name,
                    onclick: () => {
                        // Change the active location
                        showWeatherData(location);
                        storeActiveLocation(location);
                        updateLocationButtonText(location.name);
                        closeLocationsPopUp();
                    },
                    children: [createHTMLElement("span", { textContent: location.fullName })]
                }),
                createHTMLElement("button", {
                    classList: displaysFavorites
                        ? "unstar-location-button"
                        : "star-location-button",
                    onclick: () => {
                        // Either add or remove the location from the favorite locations
                        if (displaysFavorites) {
                            removeFavoriteLocation(location);
                        } else {
                            addFavoriteLocation(location);
                        }
                        // Show the favorite locations again (to refresh)
                        createLocationItems(getFavoriteLocations(), true);
                        setActiveButton($favoriteButton);
                    }
                })
            ]
        });
        $locationsList.append(element);
    });
}
