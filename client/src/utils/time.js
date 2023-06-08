export function getTimeSincePost(postDate) {
  const now = new Date();
  const postTime = new Date(postDate);
  const timeDiff = now.getTime() - postTime.getTime();

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  // const weeks =
  //   Math.floor(days / 7) == 4 && days % 7 <= 3 && days % 7 > 0
  //     ? Math.floor(days / 7) + 1
  //     : Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return seconds == 0 ? `1 seconds ago` : `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 30) {
    return `${days} days ago`;
  }
  //  else if (weeks < 5) {
  //   return `${weeks} weeks ago`;
  // }
  else if (months < 12) {
    return `${months} months ago`;
  } else {
    return `${years} years ago`;
  }
}

export function getReadableDate(date) {
  // const months = [
  //   "Tháng 1",
  //   "Tháng 2",
  //   "Tháng 3",
  //   "Tháng 4",
  //   "Tháng 5",
  //   "Tháng 6",
  //   "Tháng 7",
  //   "Tháng 8",
  //   "Tháng 9",
  //   "Tháng 10",
  //   "Tháng 11",
  //   "Tháng 12",
  // ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const postTime = new Date(date);
  const day = postTime.getDate();
  const month = months[postTime.getMonth()];
  const year = postTime.getFullYear();
  const hour = postTime.getHours(); // Lấy giờ
  const minute = postTime.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year}, ${hour}:${minute}`;
}
