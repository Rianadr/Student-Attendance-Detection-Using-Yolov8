import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
} from "@material-tailwind/react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../../public/css/styles.css';
import useHome from './hookHome';

export function Home() {
  const {
    classes,
    showMore,
    showVideo,
    showCards,
    toggleShowMore,
    handleButtonClick,
    handleBackButtonClick,
    setShowVideo,
    setShowCards,
    objectCount,
    loading,
    imgRef,
  } = useHome();

  return (
    <div className="flex flex-col h-screen">
      <div className="relative flex-grow">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60" />
        <div className="max-w-8xl container relative mx-auto pt-16 pb-32">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography variant="h1" color="white" className="mb-6 font-black">
                Student Count Detection System
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                A cutting-edge solution to monitor attendance and eliminate proxy attendance. 
                Ensure integrity in every classroom session.
              </Typography>
            </div>
          </div>

          {/* Card Section */}
          <CSSTransition in={showCards} timeout={500} classNames="fade" unmountOnExit onExited={() => setShowVideo(true)}>
            <div className="flex flex-wrap justify-center mt-10">
              <TransitionGroup className="flex flex-wrap justify-center">
                {classes.slice(0, showMore ? classes.length : 3).map((kelas) => (
                  <CSSTransition key={kelas.id} timeout={500} classNames="fade">
                    <div className="m-2">
                      <Card className="shadow-lg border shadow-gray-500/10 rounded-lg max-w-xs">
                        <CardHeader floated={false} className="relative h-40">
                          <img
                            alt={kelas.title}
                            src={kelas.image}
                            className="h-full w-full object-cover rounded-t-lg"
                          />
                        </CardHeader>
                        <CardBody className="p-4">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="mb-2 font-bold text-sm text-center"
                          >
                            {kelas.title}
                          </Typography>
                          <Typography className="font-normal text-blue-gray-500 text-xs text-center mb-4">
                            {kelas.description}
                          </Typography>
                          <div className="flex justify-center">
                            <Button variant="outlined" color="blue" onClick={handleButtonClick}>
                              Go to Detection Page
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          </CSSTransition>

          {/* Video Section */}
          <CSSTransition in={showVideo} timeout={500} classNames="fade" unmountOnExit onExited={() => setShowCards(true)}>
            <div className="flex flex-wrap justify-center mt-10">
              <Card className="shadow-lg border shadow-gray-500/10 rounded-lg w-80%">
                <CardHeader floated={false} className="relative h-80"> {/* Ubah h-40 menjadi h-80 atau lebih besar */}
                  <img ref={imgRef} controls className="h-full w-full object-cover rounded-t-lg" /> {/* Ganti img dengan video */}
                </CardHeader>
                <CardBody className="p-4">
                  <Typography variant="h6" color="red" className="font-bold text-center">
                    {loading && <p>Waiting Video Stream...</p>}
                  </Typography>
                  <Typography variant="h6" color="blue-gray" className="font-bold text-center mt-4 mb-5">
                    <p>Total Student Count</p>
                    {objectCount}
                  </Typography>
                  <div className="flex justify-center">
                    <Button variant="contained" color="gray" onClick={handleBackButtonClick}>
                      Back to Class List
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </CSSTransition>

          {/* Show More Button */}
          {!showVideo && classes.length > 3 && ( // Sembunyikan tombol Show More saat video ditampilkan
            <div className="flex justify-center mt-4">
              <Button variant="outlined" color="blue" onClick={toggleShowMore}>
                {showMore ? "Show Less" : "Show More"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
