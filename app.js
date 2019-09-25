
const localProfile = {
  name: "foo",
  email: "foo@bar.com",
  picture: "https://miro.medium.com/max/3150/0*O9lgVRoJYFe8e_a3.jpg"
}

const config = {
  hubUrls: ['http://localhost:8888/'],
  walletUrl: 'http://localhost:3000/#/register-app/',
  debug: true
}
const appInfo = {
  name: 'Profile viewer',
  description: 'Demo app for AKASHA.id',
  icon: window.location.origin + '/logo.png',
  url: 'http://localhost:3001/'
}
const Client = new window.AKASHAidClient(appInfo, config)

const hide = (id) => {
    document.getElementById(id).hidden = true
}

const show = (id) => {
  document.getElementById(id).hidden = false
}

const showNonce = () => {
  document.getElementById('nonce').innerHTML = `Security code:<h1>${Client.nonce}</h1>`
  show('nonce')
}

const showProfile = (profile) => {
  profile = profile || testProfile
  hide('request')
  const div = `<div class="profile-card js-profile-card" id="profile">
      <div class="profile-card__img">
          <img src="${profile.picture}" alt="profile card">
      </div>

      <div class="profile-card__cnt js-profile-cnt">
          <div class="profile-card__name">${profile.name}</div>
          <div class="profile-card__txt">${profile.email}</div>


          <div class="profile-card-social">
              
          </div>

      </div>

  </div>`
  document.getElementById('profile-wrapper').innerHTML = div
}


const register = async () => {
  const link = await Client.registrationLink()
  console.log(link)
  // The token and the refreshEncKey values are taked from the previous response (above)
  const attributes = ['givenName', 'email', 'picture']
  Client.requestProfile(attributes).then(response => {
    console.log(response)
    if (response.allowed) {
      const profile = {}
      const attrs = response.claim.credentialSubject
      attributes.forEach(attr => {
        profile[attr] = attrs[attr]
      })
      // add attributes
      showProfile(profile)
    }
  })
  return link
}

document.getElementById('request').addEventListener('click', async () => {
  // showProfile()
  const link = await register()

  showNonce()

  let top = window.screen.height - 300;
  top = top > 0 ? top/2 : 0;
          
  let left = window.screen.width - 400;
  left = left > 0 ? left/2 : 0;

  const idWindow = window.open(link, "Request profile","width=800,height=600" + ",top=" + top + ",left=" + left)
  idWindow.moveTo(left, top)
  idWindow.focus()
}, true)

