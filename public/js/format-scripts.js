function formatTime(dateString) {
    const postDate = new Date(dateString);
    const currentDate = new Date();
    const hourDiff = Math.floor((currentDate - postDate) / (60 * 60 * 1000));
    
    if (hourDiff === 0) {
      return "vừa xong";
    } else if (hourDiff === 1) {
      return "1 giờ trước";
    } else if (hourDiff < 24) {
      return `${hourDiff} giờ trước`;
    } else {
      return postDate.toLocaleDateString();
    }
  }
  
