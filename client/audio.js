// const URL_API = 'https://b6cc-2001-ee0-41c1-3d38-ad1f-3921-8569-5761.ap.ngrok.io';
// audioRunning();

function audioRunning() {
  // mp3-output-ttsfree(dot)com (5)
  // Lấy tọa độ của sự kiện click
  const RANDOM_READ = [
    {
      dir: 'AI_RECORDS/GHI_AM_AI_GIONG_NAM/FOMO',
      total: 40,
    },
    {
      dir: 'AI_RECORDS/GHI_AM_AI_GIONG_NAM/GIOI_THIEU_SAN_PHAM',
      total: 18,
    },
    // {
    //   dir: 'AI_RECORDS/GHI_AM_AI_GIONG_NU/FOMO',
    //   total: 50,
    // },
    // {
    //   dir: 'AI_RECORDS/GHI_AM_AI_GIONG_NU/GIOI_THIEU_SAN_PHAM',
    //   total: 15,
    // },
  ];
  let randomIndex = Math.floor(Math.random() * RANDOM_READ.length);
  let GIONG_DIR = RANDOM_READ[randomIndex];
  let AUDIO_RAN = Math.floor((Math.random() * GIONG_DIR.total) + 1);
  var audio = new Audio(`${URL_API}/${GIONG_DIR.dir}/mp3-output-ttsfree(dot)com%20(${AUDIO_RAN}).mp3`);
  audio.addEventListener('ended', function() {
    setTimeout(() => {
      audioRunning();
    }, 1000);
  });
  
  audio.play();
}