import { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';

const useHome = () => {
  const [classes, setClasses] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showVideo, setShowVideo] = useState(false); // State untuk mengontrol tampilan video
  const [showCards, setShowCards] = useState(true); // State untuk mengontrol tampilan kartu

  const imgRef = useRef(null);
  const [status, setStatus] = useState("Connecting...");
  const [loading, setLoading] = useState(true);
  const [objectCount, setObjectCount] = useState(0);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      setStatus("Live");
    });

    socket.on("disconnect", () => {
      setStatus("Disconnected");
    });

    // Listener for frame
    socket.on("frame", (data) => {
      const blob = new Blob([data], { type: 'image/jpeg' });
      const oldSrc = imgRef.current.src;

      imgRef.current.src = URL.createObjectURL(blob);
      setLoading(false);

      if (oldSrc.startsWith('blob:')) {
        URL.revokeObjectURL(oldSrc);
      }
    });

    // Listener for object count
    socket.on("count", (count) => {
      setObjectCount(parseInt(count, 10));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          title: 'CAK4WBB3 - VISI KOMPUTER',
          description: 'TULT 0702 - IF - 45 - DSIS.03',
          image: '/img/foto1.jpg',
        },
        {
          id: 2,
          title: 'CAK4WBB4 - AI',
          description: 'TULT 0703 - IF - 46 - DSIS.04',
          image: '/img/foto2.jpg',
        },
        {
          id: 3,
          title: 'CAK4WBB4 - AI',
          description: 'TULT 0704 - IF - 46 - DSIS.05',
          image: '/img/foto3.jpg',
        },
        {
          id: 4,
          title: 'CAK4WBB5 - MACHINE LEARNING',
          description: 'TULT 0705 - IF - 47 - DSIS.06',
          image: '/img/foto4.jpg',
        },
        // {
        //   id: 5,
        //   title: 'CAK4WBB6 - DATA SCIENCE',
        //   description: 'TULT 0706 - IF - 48 - DSIS.07',
        //   image: '/img/teamwork.png',
        // },
      ];
      setClasses(data);
    };
    fetchData();
  }, []);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const handleButtonClick = () => {
    setShowCards(false); // Sembunyikan kartu
  };

  const handleBackButtonClick = () => {
    setShowVideo(false); // Kembali ke daftar kelas
    // setShowCards(true); // Tampilkan kartu kembali
  };

  return {
    classes,
    showMore,
    showVideo,
    showCards,
    toggleShowMore,
    handleButtonClick,
    handleBackButtonClick,
    setShowVideo, // Kembalikan setShowVideo jika diperlukan
    setShowCards,
    objectCount,
    loading,
    imgRef,
  };
};

export default useHome;
