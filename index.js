document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const countryInfo = document.getElementById("countryInfo");

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
  });

  searchBtn.addEventListener("click", () => {
    const countryName = searchInput.value.trim();
    if (countryName) {
      fetchCountry(countryName);
    } else {
      showError("Please enter a country name.");
    }
  });

  async function fetchCountry(name) {
    const sanitized = encodeURIComponent(name.toLowerCase());
    countryInfo.innerHTML = `<div class="spinner"></div>`;
    searchBtn.disabled = true;

    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${sanitized}`
      );

      if (!res.ok) {
        throw new Error(
          res.status === 404
            ? "Country not found!"
            : `HTTP error! status: ${res.status}`
        );
      }

      const data = await res.json();

      setTimeout(() => {
        displayCountryInfo(data[0]);
        searchBtn.disabled = false;
      }, 1000);
    } catch (error) {
      console.error("Error fetching country data:", error);
      showError("Country not found");
      searchBtn.disabled = false;
    }
  }

  function displayCountryInfo(country) {
    countryInfo.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common} flag" />
      <p><strong>Country:</strong> ${country.name.common}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${country.region}</p>
    `;
  }

  function showError(message) {
    countryInfo.innerHTML = `<p class='error-message'>${message}</p>`;
  }
});
