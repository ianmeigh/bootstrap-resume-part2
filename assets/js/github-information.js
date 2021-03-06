function userInformationHTML(user) {
  return `
      <h2>${user.name}
          <span class="small-name">
              (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
          </span>
      </h2>
      <div class="gh-content">
          <div class="gh-avatar">
              <a href="${user.html_url}" target="_blank">
                  <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}" />
              </a>
          </div>
          <p>Followers: ${user.followers} - Following ${user.following} <br> Repos: ${user.public_repos}</p>
      </div>`;
}

function repoInformationHTML(repos) {

  if (repos.length == 0) {
    return "<div class='clearfix repo-list'>No repos!</div>";
  }

  let listItemsHTML = repos.map(element => {
    return `<li>
      <a href="${element.html_url}" target="_blank">${element.name}</a>
    </li>`;
  });

  return `
  <div class="clearfix repo-list">
    <p><strong>Repo List</strong></p>
    <ul>
      ${listItemsHTML.join("\n")}
    </ul>
  </div>
`;
}

const fetchGitHubInformation = () => {

  $("#gh-user-data").html("");
  $("#gh-repo-data").html("");

  let username = $("#gh-username").val();
  if (!username) {
    $("#gh-user-data").text("Please enter a GitHub username.");
    return;
  }

  $("#gh-user-data").html(`
  <div id="loader">
    <img src="assets/images/loader.gif" alt="loading..." />
  </div>`);

  // $.getJSON(`https://api.github.com/users/${username}`, function (data) {
  //   console.log(data);
  // })
  //   .done(function (userData) {
  //     $("#gh-user-data").html(userInformationHTML(userData));
  //   })
  //   .fail(function () {
  //     if (errorResponse === 404) {
  //       $("#gh-user-data").text(`No information found for user: ${username}`);
  //     } else {
  //       console.log(errorResponse);
  //       $("#gh-user-data").text(`Error: ${errorResponse}`);
  //     }
  //   });

  $.when(
    $.getJSON(`https://api.github.com/users/${username}`),
    $.getJSON(`https://api.github.com/users/${username}/repos`)
  ).done(
    function (firstResponse, secondResponse) {
      let userData = firstResponse[0];
      let repoData = secondResponse[0];
      $("#gh-user-data").html(userInformationHTML(userData));
      $("#gh-repo-data").html(repoInformationHTML(repoData));
      console.log(repoData);
    }
  ).fail(
    function (errorResponse) {
      if (errorResponse.status === 404) {
        $("#gh-user-data").text(`No information found for user: ${username}`);
      } else if (errorResponse.status === 403) {
        let resetTime = new Date(errorResponse.getResponseHeader('x-ratelimit-reset') * 1000);
        $("#gh-user-data").text(`Too many requests, please wait until ${resetTime.toLocaleTimeString()}`);
      } else {
        console.log(errorResponse);
        $("#gh-user-data").text(`Error: ${errorResponse.responseJSON.message}`);
      }
    }
  );

  // $.when(
  //   $.getJSON(`https://api.github.com/users/${username}`),
  //   $.getJSON(`https://api.github.com/users/${username}/repos`)
  // ).then(
  //   function (firstResponse, secondResponse) {
  //     let userData = firstResponse[0];
  //     let repoData = secondResponse[0];
  //     $("#gh-user-data").html(userInformationHTML(userData));
  //     $("#gh-repo-data").html(repoInformationHTML(repoData));
  //   }, function (errorResponse) {
  //     if (errorResponse === 404) {
  //       $("#gh-user-data").text(`No information found for user: ${username}`);
  //     } else {
  //       console.log(errorResponse);
  //       $("#gh-user-data").text(`Error: ${errorResponse}`);
  //     }
  //   }
  // );
};

$(fetchGitHubInformation);
