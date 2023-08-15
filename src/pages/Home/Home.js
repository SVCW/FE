import React from 'react';
import { useEffect } from 'react';
import {
  CreateActivityAction,
  DeleteActivityByUserAction,
  DeleteLikeAction,
  GetActivityByIDAction,
  GetListActivityAction,
  GetListEndActivityAction,
  GetRecommentActivityAction,
  PostLikeAction,
  RecommentActivityAction,
  UpdateActivityAction,
} from '../../redux/actions/ActivityAction';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import moment from 'moment';
import DetailActivity from '../../component/DetailActivity';
import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { FilePond, registerPlugin } from 'react-filepond';
import Swal from 'sweetalert2';
import { Dropdown } from 'primereact/dropdown';
import GoogleMapReact from 'google-map-react';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { storage_bucket } from '../../firebase';
import { GetListFanpageAction } from '../../redux/actions/FanpageAction';
import SimpleSlider from '../../component/SimpleSlider';
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useFormik } from 'formik';
import { DonationAction } from '../../redux/actions/DonationAction';
import {
  FollowAction,
  JoinAction,
  UnFollowAction,
  UnJoinAction,
} from '../../redux/actions/FollowJoinAction';
import {
  CommentAction,
  CommentRepllyAction,
} from '../../redux/actions/CommentAction';
import Loading from '../../component/Loading';
import MultiForm from '../../MultiForm';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GetListProcessTypeAction } from '../../redux/actions/ProcessTypeAction';
import {
  CreateProcessAction,
  GetProcessByActivityAction,
} from '../../redux/actions/ProcessAction';
import {
  GetUserByIdAction,
  GetUserBystatisticAction,
} from '../../redux/actions/UserAction';
import { GetListReportTypeAction } from '../../redux/actions/ReportTypeAction';
import { Toolbar } from 'primereact/toolbar';
import { CreateReportAction } from '../../redux/actions/ReportAction';
import { GetProfileByIdAction } from '../../redux/actions/ProfileAction';
import Config from '../../component/Config';
import ResponsiveHeader from '../../templates/UserTemplate/ResponsiveHeader/ResponsiveHeader';
import Header from '../../templates/UserTemplate/Header/Header';
import Carousel from '../../templates/UserTemplate/Carousel/Carousel';
import SideBar from '../../templates/UserTemplate/SideBar/SideBar';
import RecommentActivity from '../../component/RecommentActivity';
import PostDescription from './PostDescription';
import { history } from '../../App';
import { Redirect, useHistory } from 'react-router-dom';
import { http } from '../../utils/reponse';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function Home (props) {
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  };

  const [coords, setCoords] = useState([]);
  const [places, setPlaces] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  const fn = async (value) => {
    const result = await geocodeByAddress(value);
    const lnglat = await getLatLng(result[0]);

    setCoords(lnglat);
  };

  const { userByID } = useSelector((root) => root.UserReducer);
  console.log(userByID);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);

  console.log(images);
  const [tcss, setTcss] = useState('css');
  const [vprocess, setVProcess] = useState(false);
  const dandleCSS = () => {
    if (tcss === 'css') {
    }
  };
  const { userByStatis, usertotal } = useSelector((root) => root.UserReducer);
  const change = usertotal.replace(',', '.');
  console.log('change' + change);
  useEffect(() => {
    const existingData = JSON.parse(localStorage.getItem('activity'));
    const action = GetListActivityAction();
    dispatch(action);
    const action1 = GetListFanpageAction();

    dispatch(action1);
    const action2 = GetListProcessTypeAction();
    dispatch(action2);
    const action4 = GetListReportTypeAction();
    dispatch(action4);
    const action5 = GetListEndActivityAction();
    dispatch(action5);
    const action8 = GetUserBystatisticAction(userID);
    dispatch(action8);
    const action9 = GetRecommentActivityAction(userID);
    dispatch(action9);

    // console.log(existingData);
    // if (existingData) {
    //     setCmt(existingData);
    //     dispatch({ type: "HIDE_LOADING" });
    const user = localStorage.getItem('userID');
    if (user) {
      console.log('có user');
      const action = GetUserByIdAction(localStorage.getItem('userID'));
      dispatch(action);
    } else {
      // console.log('không có user');
    }
    //     return;
    // } else {
    //     const action = GetListActivityAction();
    //     dispatch(action)

    // }
  }, []);
  const { processType, activityProcess } = useSelector(
    (root) => root.ProcessTypeReducer
  );

  const initialValues = {
    forms: [
      // { name: '', email: '', selectField: '', media: [] },
      {
        processTitle: '',
        description: '',
        startDate: '',
        endDate: '',
        activityId: activityProcess,
        processTypeId: '',
        isKeyProcess: true,
        processNo: 0,
        media: [],
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    forms: Yup.array().of(
      Yup.object().shape({
        // name: Yup.string().required('Name is required'),
        // email: Yup.string().email('Invalid email').required('Email is required'),
      })
    ),
  });
  const [currentForm, setCurrentForm] = useState(0);
  const [formData, setFormData] = useState(initialValues.forms);
  const handleNext = () => {
    if (currentForm < formData.length - 1) {
      setCurrentForm((prevForm) => prevForm + 1);
    }
  };

  const handlePrevious = () => {
    if (currentForm > 0) {
      setCurrentForm((prevForm) => prevForm - 1);
    }
  };

  const handleCreateNewForm = () => {
    setFormData((prevData) => [
      ...prevData,
      {
        processTitle: '',
        description: '',
        startDate: '',
        endDate: '',
        activityId: localStorage.getItem('activityProcess'),
        processTypeId: '',
        isKeyProcess: true,
        processNo: 0,
        media: [],
      },
    ]);
    setCurrentForm((prevForm) => prevForm + 1);
  };
  const [arrDelete, setArrDelete] = useState([0]);

  useEffect(() => { }, [arrDelete]);
  const handleDeleteForm = () => {
    if (formData.length > 1) {
      setCurrentForm((prevForm) => (prevForm > 0 ? prevForm - 1 : 0));
      setFormData((prevData) =>
        prevData.filter((form, index) => index !== currentForm)
      );
      setArrDelete((prevArr) => [...prevArr, currentForm]);
      // handleButtonClick2()
    }
  };

  const handleSelectChange = (event, formIndex) => {
    const { value } = event.target;

    setFormData((prevData) =>
      prevData.map((form, index) =>
        index === formIndex ? { ...form, processTypeId: value } : form
      )
    );
  };
  const handleSubmit1 = async (values) => {
    const dataToSubmit = [...values.forms];
    await dataToSubmit.forEach((form, index) => {
      formData[index].activityId = activityProcess;
      formData[index].processTitle = form.processTitle;
      formData[index].description = form.description;
      formData[index].startDate = form.startDate;
      formData[index].endDate = form.endDate;
      formData[index].processNo = index;
    });
    const filteredData = formData.filter(
      (item) => !arrDelete.includes(item.processNo)
    );
    const action = await CreateProcessAction(filteredData);
    await dispatch(action);
    setTT((prevIsOpen) => !prevIsOpen);
  };

  const [isLoading1, setIsLoading1] = useState(false);

  const handleImageChange1 = async (e, formIndex) => {
    setIsLoading1(true);
    const fileList = e.target.files;
    const newImages = [];

    console.log(fileList);
    for (let i = 0;i < fileList.length;i++) {
      const file = fileList[i];
      const imageUrl = URL.createObjectURL(file);
      newImages.push({ linkMedia: imageUrl, type: file.type });

      try {
        const fileRef = ref(storage_bucket, file.name);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed', (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // setUploadProgress(progress);
        });

        const snapshot = await uploadTask;

        if (snapshot.state === 'success') {
          const downloadURL = await getDownloadURL(snapshot.ref);
          newImages[i].linkMedia = downloadURL; // Cập nhật link downloadURL vào mảng newImages
        }
      } catch (error) { }
    }
    setFormData((prevData) =>
      prevData.map((form, index) =>
        index === formIndex
          ? { ...form, media: [...form.media, ...newImages] }
          : form
      )
    );

    setIsLoading1(false);
    // setUploadProgress(0);
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  const { configActivity, isValidCreate, isFanpage } = useSelector(
    (root) => root.ConfigActivityReducer
  );
  const { userID } = useSelector((root) => root.LoginReducer);
  const dispatch = useDispatch();
  const { arrActivity, activityId, arrActivityRecomment } = useSelector(
    (root) => root.ActivityReducer
  );
  console.log('comment', arrActivityRecomment);
  const { arrFanpage } = useSelector((root) => root.FanpageReducer);
  const { isLoadingM } = useSelector((root) => root.LoadingReducer);
  const [cmt, setCmt] = useState([]);
  const [time, setTime] = useState([]);
  const [detail, setDetail] = useState({});
  const [create, setCreate] = useState(true);
  const textOptions = ['Theo Dõi', 'Bỏ theo Dõi'];
  const [text, setText] = useState(0);

  const handleYesClick = (activity, title) => {
    setText((prevIndex) => (prevIndex + 1) % textOptions.length);
    const currentText = textOptions[text];
    callAPI(currentText, activity, title);
  };
  const [data, setData] = useState(cmt);
  const callAPI = (text, activity, title) => {
    // Gọi API ở đây, sử dụng giá trị của `text`
    if (text === 'Theo dõi') {
      // Gọi API Theo Dõi

      const action = FollowAction(activity, userID);
      dispatch(action);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'success',
        title: `Theo Dõi chiến dịch ${title} thành công `,
      });
      // ...
    } else {
      // Gọi API Bỏ Theo Dõi
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'error',
        title: `Bỏ Theo dõi chiến dịch ${title} thành công  `,
      });
      // ...
      const action = UnFollowAction(activity, userID);
      dispatch(action);
    }
  };

  const currentText = textOptions[text];

  // const textOptions2 = ['Tham Gia', 'Hủy Tham Gia'];
  // const [text2, setText2] = useState(0);

  // const handleJoinClick = (activity, title, index) => {
  //     setCmt((prevArray) => {
  //         const newArray = [...prevArray];
  //         newArray[index].isJoin = !newArray[index].isJoin; // Toggle the state when clicking the button
  //         return newArray;
  //     });
  //     setText2((prevIndex) => (prevIndex + 1) % textOptions2.length);
  //     const currentText = textOptions2[text2];

  //     callAPI2(currentText, activity, title);
  // };

  // const callAPI2 = (text, activity, title) => {
  //     // Gọi API ở đây, sử dụng giá trị của `text`
  //     if (text === 'Tham Gia') {
  //         // Gọi API Theo Dõi
  //         const Toast = Swal.mixin({
  //             toast: true,
  //             position: 'top-end',
  //             showConfirmButton: false,
  //             timer: 3000,
  //             timerProgressBar: true,
  //             didOpen: (toast) => {
  //                 toast.addEventListener('mouseenter', Swal.stopTimer)
  //                 toast.addEventListener('mouseleave', Swal.resumeTimer)
  //             }
  //         })

  //         Toast.fire({
  //             icon: 'success',
  //             title: `Tham Gia Thành Công Sự Kiện ${title}`
  //         })
  //         const action = JoinAction(activity, userID);
  //         dispatch(action)
  //         // ...
  //     } else {
  //         // Gọi API Bỏ Theo Dõi
  //         // ...
  //         const Toast = Swal.mixin({
  //             toast: true,
  //             position: 'top-end',
  //             showConfirmButton: false,
  //             timer: 3000,
  //             timerProgressBar: true,
  //             didOpen: (toast) => {
  //                 toast.addEventListener('mouseenter', Swal.stopTimer)
  //                 toast.addEventListener('mouseleave', Swal.resumeTimer)
  //             }
  //         })

  //         Toast.fire({
  //             icon: 'error',
  //             title: `Bỏ Tham Gia Sự Kiện ${title}`
  //         })
  //         const action = UnJoinAction(activity, userID);
  //         dispatch(action)
  //     }
  // };

  // const [text2Array, setText2Array] = useState(
  //     new Array(textOptions2.length).fill(0)
  // );
  // const currentText2 = textOptions2[text2];

  //   const updatedComments = commentData.map((comment) => {
  //     if (comment.id === id) {
  //       if (comment.color === "rgb(117, 189, 240)") {
  //         return { ...comment, color: "#eae9ee" };
  //       } else {
  //         return { ...comment, color: "rgb(117, 189, 240)" };
  //       }
  //     }
  //     return comment;
  //   });
  const [joinedIndex, setJoinedIndex] = useState(null);
  // const handleJoinClick = (index, activity, isJoin, title) => {
  //   setCmt((prevArray) => {
  //     const newArray = JSON.parse(JSON.stringify(prevArray));
  //     newArray[index].isJoin = !newArray[index].isJoin;
  //     localStorage.setItem(`activity`, JSON.stringify(newArray));

  //     return newArray;
  //   });
  const handleJoinClick = async (index, activity, isJoin, title) => {
    if (isJoin) {
      setJoinedIndex(null);
      const action = UnJoinAction(activity, userID);
      dispatch(action);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,

        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'error',
        title: `Hủy tham gia sự kiện ${title} thành công`,
      });
    } else {
      setJoinedIndex(index);
      const action = JoinAction(activity, userID);
      dispatch(action);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'success',
        title: `Tham Gia Thành Công Sự Kiện ${title}`,
      });
    }
    const action = GetListActivityAction();
    await dispatch(action);
    setCmt((prevArray) => {
      const newArray = JSON.parse(JSON.stringify(prevArray));
      localStorage.getItem(`activity`, JSON.stringify(newArray));

      return newArray;
    });
  };
  //   const handleLikeClick = (id) => {
  //     const updatedComments = commentData.map((comment) => {
  //       if (comment.id === id) {
  //         if (comment.color === "rgb(117, 189, 240)") {
  //           return { ...comment, color: "#eae9ee" };
  //         } else {
  //           return { ...comment, color: "rgb(117, 189, 240)" };
  //         }
  //       }
  //       return comment;
  //     });
  //     let alreadyLiked = false;

  //     JSON.parse(localStorage.getItem("activity"))?.map((comment) => {
  //       if (comment.activityId === id && comment.like.length > 0) {
  //         comment.like.map((item) => {
  //           if (item.userId === userID) {
  //             alreadyLiked = true;
  //           }
  //         });
  //       }
  //     });

  //     let action = null;

  //     if (alreadyLiked) {
  //       action = DeleteLikeAction({
  //         userId: userID,
  //         activityId: id,
  //       });
  //     } else {
  //       action = PostLikeAction({
  //         userId: userID,
  //         activityId: id,
  //       });
  //     }
  //     dispatch(action);

  //     setCommentData(updatedComments);
  //   };
  const [followIndex, setFollowIndex] = useState(null);
  const handleFollowClick = (index, activity, isFollow, title) => {
    setCmt((prevArray) => {
      const newArray = JSON.parse(JSON.stringify(prevArray));
      newArray[index].isFollow = !newArray[index].isFollow;
      localStorage.setItem(`activity`, JSON.stringify(newArray));

      return newArray;
    });
    if (isFollow) {
      setFollowIndex(null);
      const action = UnFollowAction(activity, userID);
      dispatch(action);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'error',
        title: `Bỏ theo dõi chiến dịch ${title} thành công `,
      });
    } else {
      setFollowIndex(index);
      const action = FollowAction(activity, userID);
      dispatch(action);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'success',
        title: `Theo dõi chiến dịch ${title} thành công `,
      });
    }
    const action = GetListActivityAction();
    dispatch(action);
    setCmt((prevArray) => {
      const newArray = JSON.parse(JSON.stringify(prevArray));
      localStorage.setItem(`activity`, JSON.stringify(newArray));

      return newArray;
    });
  };

  const initialCommentData = JSON.parse(localStorage.getItem('activity'))?.map(
    (comment) => ({
      id: comment.activityId,
      isCmt: true,
      color: '#eae9ee',
    })
  );
  const [commentData, setCommentData] = useState(initialCommentData);
  const currentTime = moment();

  const [isTextInputVisible, setTextInputVisible] = useState(false);
  const [isTextInputVisible1, setTextInputVisible1] = useState(isFanpage);

  const toggleTextInput = () => {
    setTextInputVisible(!isTextInputVisible);
  };
  const toggleTextInput1 = () => {
    setTextInputVisible1(!isTextInputVisible1);
    formik.setFieldValue('isFanpageAvtivity', isTextInputVisible1);
  };
  const openPopup = () => {
    setPopupOpen(true);
  };
  const closePopup = () => {
    setPopupOpen(false);
  };
  const [acti, setActi] = useState('');
  const formik1 = useFormik({
    initialValues: {
      title: '',
      amount: 0,
      email: localStorage.getItem('emailuser'),
      phone: '',
      name: localStorage.getItem('username'),
      isAnonymous: true,
      activityId: '',
    },
    enableReinitialize: true,
    onSubmit: async (value) => {
      const action = await DonationAction(value);
      await dispatch(action);
      setPopupOpen(false);
    },
  });

  const [commentI, setCommentI] = useState('commentContent');
  const [content, setContent] = useState('');
  const [onID, setOnID] = useState('');
  const formik2 = useFormik({
    enableReinitialize: true,
    initialValues: {
      userId: userID,
      activityId: '',
      commentContent: '',
      status: true,
      commentIdReply: '',
    },
    onSubmit: (value) => {
      if (value.commentIdReply === '') {
        const action = CommentAction(value);
        dispatch(action);
        formik2.setFieldValue('commentContent', '');
      } else {
        const action = CommentRepllyAction(value);
        dispatch(action);
        // formik2.setFieldValue('commentIdReply', '');
        // setCommentI('commentContent')
        // setContent(true)
        formik2.setFieldValue('commentContent', '');
        formik2.setFieldValue('commentIdReply', '');
      }
    },
  });
  function calculateImageClass(imageCount) {
    let imageClass = 'full-width';
    if (imageCount === 2) {
      imageClass = 'half-width';
    } else if (imageCount === 3 || imageCount === 4) {
      imageClass = 'quarter-width';
    }
    return imageClass;
  }
  const [isOpen, setIsOpen] = useState(false);
  const [isDisplay, setIsDisplay] = useState(true);

  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  // const [isDisplay, setIsDisplay] = useState(true);

  const handleClick = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    setIsDisplay(true);
    formik.setFieldValue('title', '');
    formik.setFieldValue('description', '');
    formik.setFieldValue('location', '');
  };

  const handleClick1 = () => {
    setIsOpen1((prevIsOpen) => !prevIsOpen);
    // setIsDisplay(true)
  };
  const handleClick2 = () => {
    setIsOpen2((prevIsOpen) => !prevIsOpen);
    // setVProcess((prevIsOpen) => !prevIsOpen)
    // setIsDisplay(true)
  };
  const handleClick3 = () => {
    setReport((prevIsOpen) => !prevIsOpen);
    // setIsDisplay(true)
  };
  const [openpro, setOpenPro] = useState(false);
  console.log('open' + openpro);
  const [report, setReport] = useState(false);
  const popupStyle = {
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    overflow: isOpen ? 'auto' : 'hidden',
    display: isDisplay ? 'block' : 'none',
  };
  const popupStyle1 = {
    opacity: isOpen1 ? 1 : 0,
    visibility: isOpen1 ? 'visible' : 'hidden',
    overflow: isOpen1 ? 'auto' : 'hidden',
  };
  const [tt, setTT] = useState(false);
  const popupStyle9 = {
    opacity: tt ? 1 : 0,
    visibility: tt ? 'visible' : 'hidden',
    overflow: tt ? 'auto' : 'hidden',
  };
  const popupStyle2 = {
    opacity: isOpen2 ? 1 : 0,
    visibility: isOpen2 ? 'visible' : 'hidden',
    overflow: isOpen2 ? 'auto' : 'hidden',
  };
  const popupStyle3 = {
    opacity: report ? 1 : 0,
    visibility: report ? 'visible' : 'hidden',
    overflow: report ? 'auto' : 'hidden',
  };
  const [openpro1, setOpenPro1] = useState(false);
  const popupStyle4 = {
    opacity: openpro1 ? 1 : 0,
    visibility: openpro1 ? 'visible' : 'hidden',
    overflow: openpro1 ? 'auto' : 'hidden',
  };
  const handleClick6 = () => {
    setOpenPro1((prevIsOpen) => !prevIsOpen);
    // setIsDisplay(true)
  };
  const { reportType } = useSelector((root) => root.ReportType);
  // console.log(reportType);
  const arrReportType = reportType?.map((item, index) => {
    return {
      label: item.reportTypeName,
      value: item.reportTypeId,
    };
  });
  // console.log(arrReportType);

  // console.log(arrReportType);

  const formik6 = useFormik({
    initialValues: {
      reportId: 'string',
      title: 'string',
      reason: '',
      reportTypeId: 'string',
      description: 'string',
      status: true,
      userId: userID,
      activityId: '',
    },
    onSubmit: async (value) => {
      // console.log(value);
      const action = await CreateReportAction(value);
      await dispatch(action);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'success',
        title: `Báo cáo chiến dịch thành công `,
      });
      setReport((prevIsOpen) => !prevIsOpen);
    },
  });
  const onInputDropdown = (e, field) => {
    // console.log(e.target.value)
    formik6.setFieldValue('reportTypeId', e.target.value);
  };

  const history1 = useHistory();

  useEffect(() => {
    const userID = localStorage.getItem('userID');

    if (userID !== '') {
      // Do something if userID is available in localStorage
    } else {
      alert('Vui lòng đăng nhập để trải nghiệm tốt hơn');
      history.push('/');
    }
  }, [arrDelete, reportType, history]);
  const [files, setFiles] = useState('');

  useEffect(() => {
    const arrMedia = images.map((image) => ({
      linkMedia: image.url,
      type: 'image',
    }));
    formik.setFieldValue('media', arrMedia);
  }, [images]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      // endDate: currentTime.format('YYYY-MM-DD HH:mm:ss'),
      location: '',
      targetDonation: 0,
      userId: userID,
      isFanpageAvtivity: false,
      media: [],
    },
    // enableReinitialize: true,
    enableReinitialize: false,
    onSubmit: async (value) => {
      console.log(value);
      const action = await CreateActivityAction(value);
      await dispatch(action);
      formik.setFieldValue('title', '');
      formik.setFieldValue('description', '');
      formik.setFieldValue('location', '');
      formik.setFieldValue('targetDonation', 0);
      formik.setFieldValue('startDate', '');
      formik.setFieldValue('endDate', '');
      formik.setFieldValue('endactivity', '');
      formik.setFieldValue('isFanpageAvtivity', false);
      formik.setFieldValue('media', []);
      setIsOpen((prevIsOpen) => !prevIsOpen);
      setIsDisplay(false);
      // setIsOpen((prevIsOpen) => !prevIsOpen);
      // const Toast = Swal.mixin({
      //     toast: true,
      //     position: 'top-end',
      //     showConfirmButton: false,
      //     timer: 3000,
      //     timerProgressBar: true,
      //     didOpen: (toast) => {
      //         toast.addEventListener('mouseenter', Swal.stopTimer)
      //         toast.addEventListener('mouseleave', Swal.resumeTimer)
      //     }
      // })

      // Toast.fire({
      //     icon: 'success',
      //     title: `Tạo Mới Thành Công Sự Kiện `
      // })

      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: 'Tạo mới chiến dịch thành công',
          text: 'Bạn muốn thêm chi tiết tiến trình cho chiến dịch',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Thêm tiến trình',
          cancelButtonText: 'Hoàn thành',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            setTT(true);
            handleCreateNewForm();
            setTT(true);
            // swalWithBootstrapButtons.fire(
            //   "Thành công!",
            //   "Thêm tiến trình thành công.",
            //   "success"
            // );
            formik.setFieldValue('title', '');
            formik.setFieldValue('description', '');
            formik.setFieldValue('location', '');
            formik.setFieldValue('targetDonation', 0);
            formik.setFieldValue('media', []);
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              'Thành công',
              'Thêm tiến trình thành  công',
              'success'
            );
            formik.setFieldValue('title', '');
            formik.setFieldValue('description', '');
            formik.setFieldValue('location', '');
            formik.setFieldValue('targetDonation', 0);
            formik.setFieldValue('media', []);
            setImages([]);
          }
        });
    },
  });
  console.log(activityId.title);
  console.log(moment(activityId.startDate).format('MM/DD/YYYY'));
  const formik9 = useFormik({
    initialValues: {
      activityId: activityId.activityId,
      title: activityId.title,
      description: activityId.description,
      startDate: activityId.startDate,
      endDate: activityId.endDate,
      location: activityId.location,
      targetDonation: activityId.targetDonation,
    },
    // enableReinitialize: true,
    enableReinitialize: true,
    onSubmit: async (value) => {
      console.log(value);
      const action = await UpdateActivityAction(value);
      await dispatch(action);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: 'success',
        title: `Cập nhật chiến dịch ${value.title} thành công `,
      });
      // formik.setFieldValue("title", "");
      // formik.setFieldValue("description", "");
      // formik.setFieldValue("location", "");
      // formik.setFieldValue("targetDonation", 0);
      // formik.setFieldValue("startDate", '');
      // formik.setFieldValue("endactivity", '');
      // formik.setFieldValue("isFanpageAvtivity", false);
      // formik.setFieldValue("media", []);
      setOpenPro1((prevIsOpen) => !prevIsOpen);
      // setIsDisplay(false);
    },
  });

  const handleImageChange = async (e) => {
    setIsLoading(true);
    const fileList = e.target.files;

    console.log(fileList);
    const newImages = [];

    for (let i = 0;i < fileList.length;i++) {
      const file = fileList[i];
      const imageUrl = URL.createObjectURL(file);
      newImages.push({ file, url: imageUrl });

      try {
        const fileRef = ref(storage_bucket, file.name);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed', (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        });

        const snapshot = await uploadTask;

        if (snapshot.state === 'success') {
          const downloadURL = await getDownloadURL(snapshot.ref);
          const updatedImages = [...newImages];
          updatedImages[i].url = downloadURL;

          setImages([...images, ...updatedImages]);
        }
      } catch (error) { }
    }
    setIsLoading(false);
    setUploadProgress(0);
  };
  const handleImageDelete = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };
  const handleLikeClick = (id) => {
    const updatedComments = commentData.map((comment) => {
      if (comment.id === id) {
        if (comment.color === 'rgb(117, 189, 240)') {
          return { ...comment, color: '#eae9ee' };
        } else {
          return { ...comment, color: 'rgb(117, 189, 240)' };
        }
      }
      return comment;
    });
    let alreadyLiked = false;

    JSON.parse(localStorage.getItem('activity'))?.map((comment) => {
      if (comment.activityId === id && comment.like.length > 0) {
        comment.like.map((item) => {
          if (item.userId === userID) {
            alreadyLiked = true;
          }
        });
      }
    });

    let action = null;

    if (alreadyLiked) {
      action = DeleteLikeAction({
        userId: userID,
        activityId: id,
      });
    } else {
      action = PostLikeAction({
        userId: userID,
        activityId: id,
      });
    }
    dispatch(action);

    setCommentData(updatedComments);
  };
  const handleCommentClick = (id) => {
    const updatedComments = commentData.map((comment) => {
      if (comment.id === id) {
        return { ...comment, isCmt: !comment.isCmt };
      }
      return comment;
    });

    setCommentData(updatedComments);
    console.log(commentData);
  };

  useEffect(() => {
    const updatedArrActivity = arrActivity?.map((activity) => {
      const matchingComments = arrActivity?.filter(
        (comment) => comment.id === activity.activityId
      );
      return { ...activity, commentData: matchingComments };
    });
    setCmt(updatedArrActivity);
  }, [commentData, arrActivity]);
  // useEffect(() => {
  //     const updatedArrActivity = JSON.parse(localStorage.getItem('activity'))
  //     // .map((activity) => {
  //     //     // const matchingComments = commentData?.filter((comment) => comment.id === activity.activityId);
  //     //     // return { ...activity, commentData: matchingComments };
  //     // });
  //     // setCmt(updatedArrActivity)
  // }, [arrActivity]);

  const DateTime = (item) => {
    const currentTime = moment();
    const inputTime = moment(item);
    const duration = moment.duration(currentTime.diff(inputTime));
    const hoursAgo = duration.asHours();
    let timeAgoString = '';
    if (hoursAgo < 1) {
      const daysAgo = Math.floor(duration.asMinutes());
      timeAgoString = `${daysAgo} phút trước`;
    } else if (hoursAgo >= 24) {
      const daysAgo = Math.floor(duration.asDays());
      timeAgoString = `${daysAgo} ngày trước`;
    } else {
      const hoursAgo = Math.floor(duration.asHours());
      timeAgoString = `${hoursAgo} giờ trước`;
    }
    return timeAgoString;
  };
  const [titlen, setTitlen] = useState('');
  const [listActivity, setListActivity] = useState([]);

  console.log(titlen);
  const formik7 = useFormik({
    initialValues: {
      userId: userID,
      searchContent: titlen,
    },
    onSubmit: (value) => {
      console.log(value);
      const action = RecommentActivityAction(value, userID);
      dispatch(action);
    },
  });
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setTitlen(inputValue);

    formik7.setFieldValue('searchContent', inputValue); // Gán giá trị vào trường "title" trong Formik
  };

  return (
    <Fragment>
      <Config />
      <ResponsiveHeader />
      <header className>
        <div className="topbar stick">
          <NavLink to="/home" className="logo">
            <img src="images/logo.png" alt />
            <span>SVCW</span>
          </NavLink>
          <div className="searches">
            <form method="post" onSubmit={formik7.handleSubmit}>
              <input
                type="text"
                placeholder="Tìm Kiếm..."
                name="titlen"
                value={titlen}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                onClick={() => {
                  history1.push(`/endactivity?title=${titlen}`);
                }}
              >
                <i className="icofont-search" />
              </button>
              <span className="cancel-search">
                <i className="icofont-close" />
              </span>
              <div className="recent-search">
                <h4 className="recent-searches">Gần Đây</h4>
                <ul className="so-history">
                  <li>
                    <div className="searched-user">
                      {/* <figure>
                        <img
                          style={{ height: "2.5rem", width: "2.5rem" }}
                          src="images/avatar/uocAvatar.jpg"
                          alt
                        />
                      </figure> */}
                      {arrActivityRecomment.map((item, index) => {
                        return <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="long-text">-{item.title}</span>
                        </div>
                      })}
                    </div>
                    {/* <span className="trash">
                      <i className="icofont-close-circled" />
                    </span> */}
                  </li>
                  {/* <li>
                                    <div className="searched-user">
                                        <figure><img src="images/resources/user2.jpg" alt /></figure>
                                        <span>Maria K</span>
                                    </div>
                                    <span className="trash"><i className="icofont-close-circled" /></span>
                                </li> */}
                </ul>
              </div>
            </form>
          </div>
          <ul className="web-elements">
            <li>
              <div className="user-dp">
                <NavLink
                  to={`/profile/${localStorage.getItem('userID')}`}
                  title
                >
                  <img alt src={userByID?.image} />
                  <div className="name">
                    <h4>{localStorage.getItem('username')}</h4>
                  </div>
                </NavLink>
              </div>
            </li>
            {/* <li className="go-live">
                        <a href="live-stream.html" title="Go Live" data-toggle="tooltip">
                            <i>
                                <svg fill="#f00" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18px" height="18px">
                                    <path d="M 6.1015625 6.1015625 C 3.5675625 8.6345625 2 12.134 2 16 C 2 19.866 3.5675625 23.365437 6.1015625 25.898438 L 7.5195312 24.480469 C 5.3465312 22.307469 4 19.308 4 16 C 4 12.692 5.3465312 9.6925313 7.5195312 7.5195312 L 6.1015625 6.1015625 z M 25.898438 6.1015625 L 24.480469 7.5195312 C 26.653469 9.6925312 28 12.692 28 16 C 28 19.308 26.653469 22.307469 24.480469 24.480469 L 25.898438 25.898438 C 28.432437 23.365437 30 19.866 30 16 C 30 12.134 28.432437 8.6345625 25.898438 6.1015625 z M 9.6367188 9.6367188 C 8.0077188 11.265719 7 13.515 7 16 C 7 18.485 8.0077187 20.734281 9.6367188 22.363281 L 11.052734 20.947266 C 9.7847344 19.680266 9 17.93 9 16 C 9 14.07 9.7847344 12.319734 11.052734 11.052734 L 9.6367188 9.6367188 z M 22.363281 9.6367188 L 20.947266 11.052734 C 22.215266 12.319734 23 14.07 23 16 C 23 17.93 22.215266 19.680266 20.947266 20.947266 L 22.363281 22.363281 C 23.992281 20.734281 25 18.485 25 16 C 25 13.515 23.992281 11.265719 22.363281 9.6367188 z M 16 12 A 4 4 0 0 0 16 20 A 4 4 0 0 0 16 12 z" />
                                </svg></i>
                        </a>
                    </li> */}
            <li>
              <a
                href="http://localhost:3000/home"
                title="Trang chủ"
                data-toggle="tooltip"
              >
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-home"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </i>
              </a>
            </li>
            <li>
              <a
                className="mesg-notif"
                href="#"
                title="Tin nhắn"
                data-toggle="tooltip"
              >
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-message-square"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </i>
              </a>
              <span />
            </li>
            <li>
              <a
                className="mesg-notif"
                href="#"
                title="Thông báo"
                data-toggle="tooltip"
              >
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-bell"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </i>
              </a>
              <span />
            </li>
            {/* <li>
                        <a className="create" href="#" title="Add New" data-toggle="tooltip">
                            <i>
                                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                                    <line x1={12} y1={5} x2={12} y2={19} />
                                    <line x1={5} y1={12} x2={19} y2={12} />
                                </svg></i>
                        </a>
                    </li> */}
            <li className="test">
              <a href="#" className="create">
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-grid"
                  >
                    <rect x={3} y={3} width={7} height={7} />
                    <rect x={14} y={3} width={7} height={7} />
                    <rect x={14} y={14} width={7} height={7} />
                    <rect x={3} y={14} width={7} height={7} />
                  </svg>
                </i>
              </a>

              <ul className="dropdown">
                {localStorage.getItem('userID') ? (
                  <li>
                    <a href="profile.html" title>
                      <i className="icofont-user-alt-3" /> Trang cá nhân
                    </a>
                  </li>
                ) : (
                  <Fragment></Fragment>
                )}
                <li>
                  <NavLink to="/history" title>
                    <i className="icofont-flash" /> Lịch sử
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/statisticaluser" title>
                    <i class="fa-solid fa-chart-simple" /> Thống kê
                  </NavLink>
                </li>
                {userByID.fanpage === null ? (
                  <li>
                    <NavLink to="/createfanpage" title>
                      <i className="icofont-plus" /> Tạo Fanpage
                    </NavLink>
                  </li>
                ) : (
                  <Fragment></Fragment>
                )}
                {/* <li>
                <a className="invite-new" href="#" title>
                  <i className="icofont-brand-slideshare" /> Invite Collegue
                </a>
              </li> */}
                {/* <li>
                <a href="pay-out.html" title>
                  <i className="icofont-price" />
                </a>
              </li>

              <li>
                <a href="help-faq.html" title>
                  <i className="icofont-question-circle" /> Help
                </a>
              </li>
              <li>
                <a href="settings.html" title>
                  <i className="icofont-gear" /> Setting
                </a>
              </li>
              <li>
                <a href="privacy-n-policy.html" title>
                  <i className="icofont-notepad" /> Privacy
                </a>
              </li> */}
                <li>
                  <a className="dark-mod" href="#" title>
                    <i className="icofont-moon" /> Sáng/Tối
                  </a>
                </li>
                <li
                  className="logout"
                  onClick={() => {
                    const action = {
                      type: 'LOGOUT',
                    };
                    dispatch(action);
                    const action1 = {
                      type: 'LOGOUT1',
                    };
                    dispatch(action1);
                  }}
                >
                  <NavLink to="/" title>
                    <i className="icofont-power" />{' '}
                    {localStorage.getItem('userID') ? 'Đăng xuất' : 'Đăng nhập'}
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </header>
      <Carousel />

        <div className="gap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div id="page-contents" className="row merged20">
                  <div className="col-lg-3">
                    <aside className="sidebar static left">
                      <div className="widget whitish low-opacity">
                        {/* <img src="images/time-clock.png" alt /> */}
                        <div
                          className="bg-image"
                          style={{
                            backgroundImage: "url(./images/avatar/12.jpg)",
                          }}
                        />
                        <div className="date-time">
                          <div className="realtime">
                            <span id="hours">00</span>
                            <span id="point">:</span>
                            <span id="min">00</span>
                          </div>
                          <span id="date" />
                        </div>
                      </div>
                      <div className="widget">
                        <h4 className="widget-title">Thông tin cá nhân bạn</h4>
                        <span>Tiến trình hoàn thiện thông tin cá nhân</span>
                        <div
                          data-progress="tip"
                          className="progress__outer"
                          data-value={change.toString()}
                        >
                          <div className="progress__inner">{(parseFloat(change) * 100).toFixed(1)}%</div>
                        </div>
                        <ul className="prof-complete">
                          {userByStatis.phone === null ? (
                          <li>
                            <i className="icofont-plus-square" />{" "}
                            <NavLink to={`/profile/${userID}`}>
                              Cập nhật số điện thoại
                            </NavLink>
                            <em>10%</em>
                          </li>
                        ) : (
                          <div></div>
                        )}
                        {userByStatis.fullName === 'none' ? (
                          <li>
                            <i className="icofont-plus-square" />{' '}
                            <NavLink to={`/profile/${userID}`}>
                              Cập nhật họ tên
                            </NavLink>
                            <em>10%</em>
                          </li>
                        ) : (
                          <div></div>
                        )}
                        {userByStatis.image === 'none' ? (
                          <li>
                            <i className="icofont-plus-square" />{' '}
                            <NavLink to={`/profile/${userID}`}>
                              Cập nhật avartar
                            </NavLink>
                            <em>10%</em>
                          </li>
                        ) : (
                          <div></div>
                        )}
                        {userByStatis.coverImage === 'none' ? (
                          <li>
                            <i className="icofont-plus-square" />{' '}
                            <NavLink to={`/profile/${userID}`}>
                              Cập nhật ảnh bìa
                            </NavLink>
                            <em>10%</em>
                          </li>
                        ) : (
                          <div></div>
                        )}
                      </ul>
                    </div>
                    {/* complete profile widget */}
                    {/* <div className="advertisment-box">
                                                <h4 className><i className="icofont-info-circle" /> advertisment</h4>
                                                <figure>
                                                    <a href="#" title="Advertisment"><img src="images/resources/ad-widget2.gif" alt /></a>
                                                </figure>
                                            </div>adversment widget */}
                      {/* {arrActivityRecomment.map((item, index) => {
                        return <div className="widget">
                          <h4 className="widget-title">
                            <i className="icofont-flame-torch" /> {item.title}
                          </h4>
                          <ul className="premium-course">
                            <li>
                              <figure>
                                <img
                                  style={{ width: '480px', height: '180px' }}
                                  src="images/avatar/hienMau.jpg"
                                  alt
                                />
                                <span
                                  style={{ background: '#1dd1a1' }}
                                  className="tag"
                                >
                                  Đang diễn ra
                                </span>
                              </figure>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-around',
                                }}
                                className=""
                              >
                                <div>
                                  <button
                                    className="main-btn"
                                    style={{
                                      backgroundColor: '#2e86de',
                                      width: '100px',
                                      padding: '5px 4px',
                                    }}
                                  >
                                    Chi tiết
                                  </button>
                                </div>
                                <div>
                                  <button
                                    className="main-btn"
                                    style={{
                                      backgroundColor: '#2e86de',
                                      width: '100px',
                                      padding: '5px 2px',
                                    }}
                                  >
                                    Tham gia ngay
                                  </button>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      })} */}
                      {/* popular courses */}
                      
                      {/*<div className="widget">
                        <h4 className="widget-title">
                          Tổ chức{" "}
                          <a className="see-all" href="#" title>
                            Tất cả
                          </a>
                        </h4>
                        <ul className="recent-links">
                          <li>
                            <figure>
                              <img alt src="images/company/amazonComany.jpg" />
                            </figure>
                            <div className="re-links-meta">
                              <h6>
                                <a title href="#">
                                  Đây là tổ chức có trụ sở tại mỹ....
                                </a>
                              </h6>
                            </div>
                          </li>
                          <li>
                            <figure>
                              <img alt src="images/company/ctyFPT.png" />
                            </figure>
                            <div className="re-links-meta">
                              <h6>
                                <a title href="#">
                                  Đây là tập đoàn chuyên về công nghệ
                                </a>
                              </h6>
                            </div>
                          </li>
                          <li>
                            <figure>
                              <img alt src="images/company/ctyTGDD.png" />
                            </figure>
                            <div className="re-links-meta">
                              <h6>
                                <a title href="#">
                                  Tập đoàn chuyên về các đồ dùng thông minh như
                                  điện thoại, máy tính,...
                                </a>
                              </h6>
                            </div>
                          </li>
                        </ul>
                      </div> */}
                  </aside>
                </div>
                <div className="col-lg-6">
                  <ul class="filtr-tabs">
                    <li>
                      <NavLink to="/home">Trang chủ</NavLink>
                    </li>
                    <li>
                      <NavLink to="/endactivity">
                        Chiến dịch đã kết thúc
                      </NavLink>
                    </li>
                  </ul>
                  {/* <ul className="filtr-tabs">
                                            <li><a className="active" href="#" title>Home</a></li>
                                            <li><a href="#" title>Recent</a></li>
                                            <li><a href="#" title>Favourit</a></li>
                                        </ul>tab buttons */}
                  {isValidCreate === 'true' ? (
                    <div
                      className="main-wraper"
                      onClick={handleClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="new-title">
                        Bạn muốn tạo chiến dịch mới
                      </span>
                      <div className="new-post">
                        <form method="post" onClick={handleClick}>
                          <i className="icofont-pen-alt-1" />
                          <input
                            onClick={handleClick}
                            type="text"
                            placeholder="Tạo chiến dịch"
                          />
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="main-wraper">
                    <div className="user-post">
                      <div className="friend-info">
                        <figure>
                          <i className="icofont-learn" />
                        </figure>
                        <div className="friend-name">
                          <ins>
                            <a title href="time-line.html">
                              Đề xuất
                            </a>
                          </ins>
                          <span>
                            <i className="icofont-runner-alt-1" /> Theo dõi
                            fanpage tương tự
                          </span>
                        </div>
                        <SimpleSlider arrFanpage={arrFanpage} />
                      </div>
                    </div>
                  </div>
                  {/* suggested friends */}
                  {cmt
                    .filter(
                      (item) =>
                        item.status === 'Active' &&
                        item.title.toLowerCase().includes(titlen)
                    )
                    .map((item, index) => {
                      console.log(item);
                      const detailItem = item;
                      let isAlreadyLiked = false;
                      let isAlreadyJoined = false;
                      let isAlreadyFollowed = false;
                      item?.like?.map((user) => {
                        if (user.userId === userByID.userId) {
                          console.log(user.userId === userByID.userId);
                          //item?.like?
                          isAlreadyLiked = true;
                        }
                      });

                        item?.followJoinAvtivity?.map((user) => {
                          if (user.userId === userByID.userId) {
                            isAlreadyFollowed = user.isFollow;
                            isAlreadyJoined = user.isJoin;
                          }
                        });
                        //TODO
                        return (
                          <div className="main-wraper">
                            <div className="user-post">
                              <div className="friend-info">
                                <figure>
                                  <em>
                                    <svg
                                      style={{ verticalAlign: "middle" }}
                                      xmlns="http://www.w3.org/2000/svg"
                                      width={15}
                                      height={15}
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="#7fba00"
                                        stroke="#7fba00"
                                        d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"
                                      ></path>
                                    </svg>
                                  </em>
                                  <img
                                    style={{ height: "3rem", width: "3.5rem" }}
                                    alt
                                    src={item.user.image}
                                  />
                                </figure>
                                <div className="friend-name">
                                  <div className="more">
                                    <div className="more-post-optns">
                                      <i className>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width={24}
                                          height={24}
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="feather feather-more-horizontal"
                                        >
                                          <circle cx={12} cy={12} r={1} />
                                          <circle cx={19} cy={12} r={1} />
                                          <circle cx={5} cy={12} r={1} />
                                        </svg>
                                      </i>
                                      <ul>
                                        {userID === item.userId ? (
                                          <li
                                            onClick={() => {
                                              handleClick6();
                                              const action =
                                                GetActivityByIDAction(
                                                  item.activityId
                                                );
                                              dispatch(action);
                                            }}
                                          >
                                            <i className="icofont-pen-alt-1" />
                                            Sửa bài đăng
                                            <span>
                                              Chỉnh sửa và cập nhật chi tiết bài
                                              đăng
                                            </span>
                                          </li>
                                        ) : (
                                          <div></div>
                                        )}
                                        {/* <li>
                                        <i className="icofont-ban" />
                                        Ẩn bài đăng
                                        <span>
                                          Giusp bạn ẩn bài đăng nếu chiến dịch
                                          có vấn đề
                                        </span>
                                      </li> */}
                                        {userID === item.userId ? (
                                          <li
                                            onClick={() => {
                                              Swal.fire({
                                                title: "Bạn muốn xóa?",
                                                text: "Bạn có chắc muốn xóa bài viết này!",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                confirmButtonText: "Xóa!",
                                              }).then((result) => {
                                                if (result.isConfirmed) {
                                                  Swal.fire(
                                                    "Xóa thành công!",
                                                    "Xóa thành công chiến dịch.",
                                                    "success"
                                                  );
                                                  const action =
                                                    DeleteActivityByUserAction(
                                                      item.activityId
                                                    );
                                                  dispatch(action);
                                                }
                                              });
                                            }}
                                          >
                                            <i className="icofont-ui-delete" />
                                            Xóa bài đăng
                                            <span>
                                              Xóa những bài đăng khi bạn cảm
                                              thấy có vấn đề không ổn
                                            </span>
                                          </li>
                                        ) : (
                                          <div></div>
                                        )}
                                        {userID !== item.userId ? (
                                          <li
                                            onClick={() => {
                                              setReport(true);
                                              formik6.setFieldValue(
                                                "activityId",
                                                item.activityId
                                              );
                                            }}
                                          >
                                            <i className="icofont-flag" />
                                            Báo cáo bài đăng
                                            <span>
                                              nhầm báo cáo những vấn đề bất
                                              thường đến cho người quản lý
                                            </span>
                                          </li>
                                        ) : (
                                          <div></div>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                  <ins>
                                  <NavLink
                                    to={`/profile/${localStorage.getItem(
                                      'userID'
                                    )}`}
                                    title
                                  >
                                    <h4>{item.user?.username}</h4>
                                  </NavLink>
                                  </ins>
                                  <span>
                                    {" "}
                                    {DateTime(item.createAt)}{" "}
                                    <i className="icofont-globe" />
                                  </span>
                                </div>
                                <div className="post-meta">
                                  {/* <em><a href="https://themeforest.net/item/winku-social-network-toolkit-responsive-template/22363538" title target="_blank">https://themeforest.net/item/winku-social-network-toolkit-responsive-template/22363538</a></em> */}

                                {/* <a href="https://themeforest.net/item/winku-social-network-toolkit-responsive-template/22363538" className="post-title" target="_blank">{item.title}</a> */}
                                {/* <p>
                                                                {item.description}
                                                            </p> */}

                                {/* hình ảnh */}
                                {item.process.length !== 0 ? (
                                  <NavLink
                                    to={`/detailprocess/${item.activityId}`}
                                    style={{
                                      fontSize: '20px',
                                      fontWeight: 'bold',
                                      color: '#3f6ad8',
                                      marginBottom: '20px',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                      // handleClick2()
                                      // const action = GetProcessByActivityAction(item.activityId);
                                      // dispatch(action)
                                    }}
                                  >
                                    Xem tiến trình
                                  </NavLink>
                                ) : (
                                  <div></div>
                                )}
                                <div className="row">
                                  <div
                                    style={{
                                      padding: '0',
                                      display: 'flex',
                                      alignContent: 'center',
                                    }}
                                    className="col-lg-12"
                                  >
                                    <h3
                                      style={{
                                        fontSize: '25px',
                                        fontWeight: 'bold',
                                        width: '450px',
                                        wordWrap: 'break-word',
                                        color: '#2d3436',
                                      }}
                                      className="col-lg-12"
                                    >
                                      {item.title}
                                    </h3>

                                    {/* bla bla bla theo dõi */}
                                  </div>
                                </div>
                                <div style={{ display: "flex" }}>
                                  <div style={{
                                    color: '#747d8c',
                                    fontWeight: 400,
                                    fontSize: '15px',
                                  }}>
                                    {" "}
                                    <span
                                      style={{

                                        color: '#747d8c',
                                        fontWeight: 400,
                                        fontSize: '15px',
                                      }}
                                    >
                                      Thời gian:{" "}
                                    </span>{" "}
                                    {moment(item.startDate).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "15px",
                                      fontWeight: "900",
                                      padding: "0 0.5rem",
                                    }}
                                  >
                                    <span style={{
                                      color: '#747d8c',
                                      fontWeight: 400,
                                      fontSize: '15px',
                                    }}>-</span>
                                  </div>
                                  <div style={{
                                    color: '#747d8c',
                                    fontWeight: 400,
                                    fontSize: '15px',
                                  }}>
                                    {" "}
                                    <span
                                      style={{
                                        color: '#747d8c',
                                        fontWeight: 400,
                                        fontSize: '15px',
                                      }}
                                    > </span>{" "}
                                    {moment(item.endDate).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </div>
                                </div>

                                {/* chi tiết chiến dịch */}
                                <p className="mt-3 mt-detail">
                                  <span className="mt-detail"></span>{' '}
                                  <PostDescription
                                    description={item.description}
                                  />
                                </p>

                                {/* <p className="mt-3 mt-detail">
                                    <span className="mt-detail">Dia chi :</span>{" "}
                                    {item.location}{" "}
                                  </p> */}

                                <figure style={{}}>
                                  {/* <p style={{ width: '100%' }}>fetched-image</p> */}

                                  <div className="image-gallery-flex">
                                    {item?.media?.length <= 3
                                      ? item.media.map((image, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className={`image-container-post`}
                                            >
                                              <a
                                                data-toggle="modal"
                                                data-target="#img-comt"
                                                href="images/resources/album1.jpg"
                                                onClick={() => {
                                                  setDetail(detailItem);
                                                }}
                                              >
                                                <img
                                                  src={image.linkMedia}
                                                  alt={`Image ${image.id}`}
                                                />
                                              </a>
                                            </div>
                                          );
                                        })
                                      : item.media
                                          ?.slice(0, 4)
                                          .map((image, index) => {
                                            return index !== 3 ? (
                                              <div
                                                key={index}
                                                className={`image-container-post`}
                                              >
                                                <a
                                                  data-toggle="modal"
                                                  data-target="#img-comt"
                                                  href="images/resources/album1.jpg"
                                                  onClick={() => {
                                                    setDetail(detailItem);
                                                  }}
                                                >
                                                  <img
                                                    src={image.linkMedia}
                                                    alt={`Image ${image.id}`}
                                                  />
                                                </a>
                                              </div>
                                            ) : (
                                              <div
                                                key={index}
                                                className={`image-container-post-last`}
                                              >
                                                <a
                                                  data-toggle="modal"
                                                  data-target="#img-comt"
                                                  href="images/resources/album1.jpg"
                                                  onClick={() => {
                                                    setDetail(detailItem);
                                                  }}
                                                >
                                                  <div className="overlay">
                                                    +{item.media.length - 4}
                                                  </div>
                                                  <img
                                                    src={image.linkMedia}
                                                    alt={`Image ${image.id}`}
                                                  />
                                                </a>
                                              </div>
                                            );
                                          })}
                                  </div>
                                </figure>

                                {/* <p className="mt-3">
                                  <span
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                      fontSize: "15px",
                                    }}
                                  >
                                    Chi tiết :
                                  </span>{" "}
                                  {item.description}
                                </p> */}

                                {/* <div style={{ paddingBottom: '20px' }}>
                                  <div style={{ fontSize: '17px' }}> <span style={{ fontWeight: 600 }}>  </span> {moment(item.startDate).format('DD/MM/YYYY')}</div>
                                  <div>-</div>
                                  <div style={{ fontSize: '17px' }}> <span style={{ fontWeight: 600 }}></span> {moment(item.endDate).format('DD/MM/YYYY')}</div>
                                </div> */}

                                {item.targetDonation !== 0 ? (
                                  <div className="mb-4">
                                    <p
                                      style={{
                                        color: 'blue',
                                        fontWeight: '400',
                                        fontSize: '15px',
                                      }}
                                    >
                                      Đã quyên góp được <br />
                                      <span
                                        style={{
                                          color: 'blue',
                                          fontSize: '15px',
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: 'blue',
                                            fontSize: '15px',
                                          }}
                                        >
                                          {item.realDonation.toLocaleString()}
                                        </span>{' '}
                                        đ /
                                        <span
                                          style={{
                                            color: 'blue',
                                            fontSize: '15px',
                                          }}
                                        >
                                          {item.targetDonation.toLocaleString()}{' '}
                                          đ
                                        </span>{' '}
                                      </span>
                                    </p>

                                    {/* <div>
                                      {" "}
                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "15px",
                                        }}
                                      >
                                        {" "}
                                        - Mục tiêu :{" "}
                                      </span>{" "}
                                      <span
                                        style={{
                                          color: "blue",
                                          fontSize: "15px",
                                        }}
                                      >
                                        {item.targetDonation.toLocaleString()}{" "}
                                        vnđ
                                      </span>{" "}
                                    </div>
                                    <div className="mb-3">
                                      {" "}
                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "15px",
                                        }}
                                      >
                                        - Tổng Tiền Đã Nhận :{" "}
                                      </span>{" "}
                                      <span
                                        style={{
                                          color: "blue",
                                          fontSize: "15px",
                                        }}
                                      >
                                        {item.realDonation.toLocaleString()} vnđ
                                      </span>{" "}
                                    </div> */}
                                    <input
                                      type="range"
                                      min="0"
                                      max={item.targetDonation}
                                      value={item.realDonation}
                                      // onChange={handleChange}
                                      className="range-slider"
                                      style={{
                                        background: `linear-gradient(to right,  #4287f5 0%, #4287f5  ${
                                          (item.realDonation /
                                            item.targetDonation) *
                                          100
                                        }%, #ddd ${
                                          (item.realDonation /
                                            item.targetDonation) *
                                          100
                                        }%, #ddd 100%)`,
                                      }}
                                    />
                                    {/* <div className="range-value" style={{ position: 'absolute', left: `${((item.realDonation - 5) * 100) / (100 - 0)}%` }}>{item.realDonation}%</div> */}
                                    {item.realDonation !== 0 ? (
                                      <div></div>
                                    ) : (
                                      <div
                                        className="range-value"
                                        style={{ position: 'absolute' }}
                                      >
                                        0
                                      </div>
                                    )}
                                    {/* <div className="range-value" style={{ position: 'absolute' }}>0</div> */}
                                    {/* {item.realDonation !== 0 ? <div className="range-value" style={{ position: 'absolute', left: `${((item.realDonation - 5) * 100) / (100 - 0)}%` }}>{((item.realDonation / item.targetDonation) * 100).toString().split('.')[0]}%</div> : <div className="range-value" style={{ position: 'absolute', left: `${((item.realDonation - 0) * 100) / (100 - 0)}%` }}>{((item.realDonation / item.targetDonation) * 100).toString().split('.')[0]}%</div>} */}
                                    {item.realDonation === 0 ? (
                                      <div></div>
                                    ) : (
                                      <div
                                        className="range-value"
                                        style={{
                                          position: 'absolute',
                                          left: `${
                                            (item.realDonation /
                                              item.targetDonation) *
                                            100
                                          }%`,
                                        }}
                                      >
                                        {' '}
                                        {(item.realDonation /
                                          item.targetDonation) *
                                          100}
                                        %
                                      </div>
                                    )}
                                    <div
                                      className="range-value"
                                      style={{
                                        color: 'blue',
                                        position: 'absolute',
                                        right: '10px',
                                      }}
                                    >
                                      {item.targetDonation.toLocaleString()} vnđ
                                    </div>
                                  </div>
                                ) : (
                                  <div></div>
                                )}

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",

                                  }}
                                  className={
                                    (item.targetDonation !== 0 ? 'marginform' : 'nomarginform') +
                                    ' ' +
                                    (item.process.length !== 0 ? 'processform' : 'noprocessform')
                                  }
                                >
                                  <button
                                    className={` ${isAlreadyJoined
                                      ? "btn-change"
                                      : "btn-color"
                                      } mb-4 mt-4 btn-add ${item.targetDonation !== 0 ? 'marginfollow' : 'sas'}`}
                                    onClick={() => {
                                      handleJoinClick(
                                        index,
                                        item.activityId,
                                        isAlreadyJoined,
                                        item.title
                                      );
                                    }}
                                  >
                                    {isAlreadyJoined
                                      ? "Hủy Tham gia"
                                      : "Tham gia"}
                                  </button>

                                  <button
                                    className={` ${isAlreadyFollowed
                                      ? "btn-change"
                                      : "btn-color"
                                      } mb-4 mt-4`}
                                    onClick={() => {
                                      handleFollowClick(
                                        index,
                                        item.activityId,
                                        isAlreadyFollowed,
                                        item.title
                                      );
                                    }}
                                  >
                                    {
                                      //TODO
                                    }
                                    {isAlreadyFollowed
                                      ? "Hủy theo dõi"
                                      : "Theo dõi"}
                                  </button>
                                  {item.targetDonation !== 0 ? (
                                    <button
                                      className=" btn-color btn-donate"
                                      onClick={() => {
                                        // setActi(item.activityId)
                                        formik1.setFieldValue(
                                          "activityId",
                                          item.activityId
                                        );
                                        openPopup();
                                      }}
                                    >
                                      Ủng hộ
                                    </button>
                                  ) : (
                                    <div></div>
                                  )}
                                  {item.process.length !== 0 ? (
                                    <NavLink
                                      to={`/detailprocess/${item.activityId}`}
                                      style={{
                                        marginTop: '10x'
                                      }}
                                      className="btn-color mb-4 mt-4"
                                      onClick={() => {
                                        // handleClick2()
                                        // const action = GetProcessByActivityAction(item.activityId);
                                        // dispatch(action)
                                      }}
                                    >
                                      Xem tiến trình
                                    </NavLink>
                                  ) : (
                                    <div></div>
                                  )}
                                </div>

                                <div className="we-video-info">
                                  <div
                                    className="emoji-state"
                                    style={{
                                      display: 'flex',
                                      alignContent: 'center',
                                      paddingTop: '20px',
                                    }}
                                  >
                                    <div className="popover_wrapper">
                                      <a
                                        className="popover_title"
                                        href="#"
                                        title
                                      >
                                        <img
                                          alt
                                          src="images/smiles/thumb.png"
                                        />
                                      </a>
                                      <div className="popover_content">
                                        <span>
                                          <img
                                            alt
                                            src="images/smiles/thumb.png"
                                          />
                                          Đã thích
                                        </span>
                                        <ul className="namelist">
                                          {item?.like?.length <= 4
                                            ? item?.like.map((userItem) => {
                                                return (
                                                  <li>
                                                    {userItem.user.username}
                                                  </li>
                                                );
                                              })
                                            : item?.like
                                                ?.slice(0, 4)
                                                .map((userItem, index) => {
                                                  index < 4 ? (
                                                    <li>
                                                      {userItem.user.username}
                                                    </li>
                                                  ) : (
                                                    <li>
                                                      <span>
                                                        +{item?.like.length - 5}
                                                      </span>
                                                    </li>
                                                  );
                                                })}
                                        </ul>
                                      </div>
                                    </div>

                                    <p>{item.like.length || 0}</p>
                                    <div style={{ marginLeft: "20px" }}>
                                      <div
                                        style={{
                                          color: "blue",
                                          fontSize: "15px",
                                        }}
                                      >
                                        <span>
                                          {(item.comment ? item.comment.length : 0) +
                                            (item.comment.inverseReply ? item.comment?.inverseReply?.length : 0)
                                          } bình luận
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="stat-tools">
                                  <div
                                    className=""
                                    style={{
                                      backgroundColor: `${isAlreadyLiked
                                        ? "rgb(117, 189, 240)"
                                        : "#eae9ee"
                                        }`,
                                      borderRadius: "4px",
                                      color: "#82828e",
                                      display: "inline-block",
                                      fontSize: "13px",
                                      padding: "5px 20px",
                                      verticalAlign: "middle",
                                      transition: "all 0.2s linear 0s",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      handleLikeClick(item.activityId);
                                    }}
                                  >
                                    <div className="Like ">
                                      <a className="Like__link">
                                        <i className="icofont-like" /> Thích
                                      </a>
                                    </div>
                                  </div>
                                  <div className="box">
                                    <div className="Emojis">
                                      <div className="Emoji Emoji--like">
                                        <div className="icon icon--like" />
                                      </div>
                                      <div className="Emoji Emoji--love">
                                        <div className="icon icon--heart" />
                                      </div>
                                      <div className="Emoji Emoji--haha">
                                        <div className="icon icon--haha" />
                                      </div>
                                      <div className="Emoji Emoji--wow">
                                        <div className="icon icon--wow" />
                                      </div>
                                      <div className="Emoji Emoji--sad">
                                        <div className="icon icon--sad" />
                                      </div>
                                      <div className="Emoji Emoji--angry">
                                        <div className="icon icon--angry" />
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="comment-to bg "
                                    onClick={() =>
                                      handleCommentClick(item.activityId)
                                    }
                                  >
                                    <i className="icofont-comment" /> Bình
                                    luận
                                  </div>
                                  <a title href="#" className="share-to">
                                    <i className="icofont-share-alt" /> Chia
                                    sẻ
                                  </a>
                                  {/* <div className="emoji-state" style={{ display: 'flex', alignContent: 'center' }}>
                                                                    <div className="popover_wrapper" >
                                                                        <a className="popover_title" href="#" title><img alt src="images/smiles/thumb.png" /></a>
                                                                        <div className="popover_content">
                                                                            <span><img alt src="images/smiles/thumb.png" />
                                                                                Likes</span>
                                                                            <ul className="namelist">
                                                                                <li>Jhon Doe</li>
                                                                                <li>Amara Sin</li>
                                                                                <li>Sarah K.</li>
                                                                                <li><span>20+ more</span></li>
                                                                            </ul>
                                                                        </div>

                                                                    </div>

                                                                    <p>{item.numberLike}+</p>
                                                                    <div style={{ marginLeft: '20px' }}>
                                                                        <div style={{ color: 'blue', fontSize: '15px' }}><span>{item.comment.length} bình luận</span></div>
                                                                    </div>
                                                                </div> */}
                                </div>
                                <div
                                  className="new-comment"
                                  style={{ display: 'block' }}
                                >
                                  <form
                                    method="post"
                                    onSubmit={formik2.handleSubmit}
                                    style={{ position: 'relative' }}
                                  >
                                    <div style={{ paddingBottom: '10px' }}>
                                      {onID === item.activityId ? (
                                        <div
                                          className="commentT"
                                          style={{
                                            display: 'flex',
                                            alignContent: 'center',
                                          }}
                                        >
                                          <span style={{ paddingTop: '6px' }}>
                                            Trả lời bình luận :{' '}
                                          </span>
                                          <div
                                            style={{ marginLeft: '10px' }}
                                            className="textcmt"
                                          >
                                            {' '}
                                            @{content}
                                            {setOnID === item.activityId ? (
                                              <span
                                                style={{
                                                  color: 'red',
                                                  fontSize: '18px',
                                                  cursor: 'pointer',
                                                  paddingLeft: '4px',
                                                }}
                                                onClick={() => {
                                                  setOnID('');
                                                  setTcss('35px');
                                                }}
                                              >
                                                x
                                              </span>
                                            ) : (
                                              <span
                                                style={{
                                                  color: 'red',
                                                  fontSize: '18px',
                                                  cursor: 'pointer',
                                                  paddingLeft: '4px',
                                                }}
                                                onClick={() => {
                                                  setOnID('');
                                                  setTcss('10px');
                                                }}
                                              >
                                                x
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          style={{
                                            paddingTop: '6px',
                                            paddingBottom: '10px',
                                          }}
                                        ></div>
                                      )}
                                    </div>
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={formik2.values.commentContent}
                                      name={commentI}
                                      onChange={formik2.handleChange}
                                      className="input-comment"
                                    />
                                    {onID === item.activityId ? (
                                      <button
                                        style={{
                                          position: 'absolute',
                                          top: '52px',
                                        }}
                                        type="submit"
                                        onClick={async () => {
                                          // await setTextI(item.activityId)
                                          formik2.setFieldValue(
                                            'activityId',
                                            item.activityId
                                          );
                                        }}
                                      >
                                        <i className="icofont-paper-plane" />
                                      </button>
                                    ) : (
                                      <button
                                        style={{
                                          position: 'absolute',
                                          top: '40px',
                                        }}
                                        type="submit"
                                        onClick={async () => {
                                          // await setTextI(item.activityId)
                                          formik2.setFieldValue(
                                            'activityId',
                                            item.activityId
                                          );
                                        }}
                                      >
                                        <i className="icofont-paper-plane" />
                                      </button>
                                    )}

                                    {item?.commentData[0]?.isCmt ? (
                                      <div></div>
                                    ) : (
                                      item.comment.map((item, index) => {
                                        return (
                                          <div className="comments-area">
                                            <ul>
                                              <li>
                                                <figure>
                                                  <img
                                                    alt
                                                    src={item.user.image}
                                                  />
                                                </figure>
                                                <div className="commenter">
                                                  <h5>
                                                    <a title href="#">
                                                      {item.user?.username}
                                                    </a>
                                                  </h5>
                                                  <span>
                                                    {DateTime(item.datetime)}
                                                  </span>
                                                  <p>{item.commentContent}</p>
                                                  {/* <span>you can view the more detail via
                                                                                                link</span>
                                                                                            <a title href="#">https://www.youtube.com/watch?v=HpZgwHU1GcI</a> */}
                                                </div>
                                                {/* <span title="Like" onClick={() => {
                                                                                        }}><i className="icofont-heart" /></span> */}
                                                  <a
                                                    title="Reply"
                                                    onClick={() => {
                                                      formik2.setFieldValue(
                                                        "commentIdReply",
                                                        item.commentId
                                                      );
                                                      // setCommentI('commentIdReply')
                                                      setContent(
                                                        item.user?.username
                                                      );
                                                      setOnID(item.activityId);
                                                    }}
                                                    className="reply-coment"
                                                  >
                                                    <i className="icofont-reply" />
                                                  </a>
                                                </li>
                                                <li>
                                                  {item.inverseReply?.map(
                                                    (item, index) => {
                                                      return (
                                                        <div
                                                          key={index}
                                                          className="ml-5"
                                                        >
                                                          <figure>
                                                            <img
                                                              alt
                                                              src={
                                                                item.user.image
                                                              }
                                                            />
                                                          </figure>
                                                          <div className="commenter">
                                                            <h5>
                                                              <a title href="#">
                                                                {
                                                                  item.user
                                                                    ?.username
                                                                }
                                                              </a>
                                                            </h5>
                                                            <span>
                                                              {DateTime(
                                                                item.datetime
                                                              )}
                                                            </span>
                                                            <p>
                                                              {
                                                                item.commentContent
                                                              }
                                                            </p>
                                                            {/* <span>you can view the more detail via
                                                                                                link</span>
                                                                                            <a title href="#">https://www.youtube.com/watch?v=HpZgwHU1GcI</a> */}
                                                        </div>
                                                        {/* <span title="Like" onClick={() => {
                                                                                        }}><i className="icofont-heart" /></span> */}
                                                        {/* <a title="Reply" onClick={() => {
                                                                                                formik2.setFieldValue('commentIdReply', item.commentId)
                                                                                                // setCommentI('commentIdReply')
                                                                                                setContent(item.user?.username)
                                                                                                setOnID(item.activityId)

                                                                                            }} className="reply-coment"><i className="icofont-reply" /></a> */}
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              </li>
                                            </ul>
                                          </div>
                                        );
                                      })
                                    )}
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  <div className="loadmore">
                    <div className="sp sp-bars" />
                    <a href="#" title data-ripple>
                      Load More..
                    </a>
                  </div>
                  {/* loadmore buttons */}
                </div>
                <div className="col-lg-3">
                  <aside className="sidebar static right">
                    {localStorage.getItem('userID') &&
                    userByID?.fanpage?.status === 'Active' ? (
                      <div className="widget">
                        <h4 className="widget-title">Nhóm của bạn</h4>
                        <ul className="ak-groups">
                          <li>
                            <figure>
                              <img
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectfit: 'cover',
                                }}
                                src={userByID?.fanpage?.avatar}
                                alt
                              />
                            </figure>
                            <div className="your-grp">
                              <h5>
                                <NavLink
                                  to={`/fanpage/${localStorage.getItem(
                                    'userID'
                                  )}`}
                                  title
                                  style={{
                                    fontSize: '20px',
                                    width: '200px',
                                    wordWrap: 'break-word',
                                  }}
                                >
                                  {userByID?.fanpage?.fanpageName}
                                </NavLink>
                              </h5>
                              <NavLink to="/" title>
                                <i className="icofont-bell-alt" />
                                Thông báo
                                <span>13</span>
                              </NavLink>
                              <NavLink
                                to=""
                                href="group-feed.html"
                                title
                                className="promote"
                                onClick={() => {}}
                              >
                                Chi tiết
                              </NavLink>
                            </div>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    <RecommentActivity />
                    {/* suggested group */}
                    <div className="widget">
                      <h4 className="widget-title">Giải trí</h4>
                      <div className="ask-question">
                        <div className="rec-events bg-purple">
                          <i className="icofont-gift" />
                          <h6>
                            <a title href>
                              Game xúc xắc
                            </a>
                          </h6>
                          <img alt src="images/clock.png" />
                        </div>
                        <NavLink to="/game">Chơi game</NavLink>
                      </div>
                    </div>
                    {/* ask question widget */}
                    {/* <div className="widget">
                                                <h4 className="widget-title">Explor Events <a className="see-all" href="#" title>Xem Tất Cả</a></h4>
                                                <div className="rec-events bg-purple">
                                                    <i className="icofont-gift" />
                                                    <h6><a title href>BZ University good night event in columbia</a>
                                                    </h6>
                                                    <img alt src="images/clock.png" />
                                                </div>
                                                <div className="rec-events bg-blue">
                                                    <i className="icofont-microphone" />
                                                    <h6><a title href>The 3rd International Conference 2020</a></h6>
                                                    <img alt src="images/clock.png" />
                                                </div>
                                            </div> */}
                    {/* event widget */}
                    {/* <div className="widget">
                                                <span><i className="icofont-globe" /> Sponsored</span>
                                                <ul className="sponsors-ad">
                                                    <li>
                                                        <figure><img src="images/resources/sponsor.jpg" alt /></figure>
                                                        <div className="sponsor-meta">
                                                            <h5><a href="#" title>IQ Options Broker</a></h5>
                                                            <a href="#" title target="_blank">www.iqvie.com</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img src="images/resources/sponsor2.jpg" alt /></figure>
                                                        <div className="sponsor-meta">
                                                            <h5><a href="#" title>BM Fashion Designer</a></h5>
                                                            <a href="#" title target="_blank">www.abcd.com</a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div> */}
                    {/* sponsord */}
                    {/* <div className="widget stick-widget">
                                                <h4 className="widget-title">Who's follownig</h4>
                                                <ul className="followers">
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar.jpg" />
                                                        </figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Kelly Bill</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar2.jpg" />
                                                        </figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Issabel</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar3.jpg" />
                                                        </figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Andrew</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar4.jpg" />
                                                        </figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Sophia</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <figure><img alt src="images/resources/friend-avatar5.jpg" />
                                                        </figure>
                                                        <div className="friend-meta">
                                                            <h4>
                                                                <a title href="time-line.html">Allen</a>
                                                                <span>Dept colleague</span>
                                                            </h4>
                                                            <a className="underline" title href="#">Follow</a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>whos following */}
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <figure className="bottom-mockup">
        <img src="images/footer.png" alt />
      </figure>
      <div className="bottombar">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <span className>
                © copyright All rights reserved by SVCW 2023
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* bottombar */}
      <div className="wraper-invite">
        <div className="popup">
          <span className="popup-closed">
            <i className="icofont-close" />
          </span>
          <div className="popup-meta">
            <div className="popup-head">
              <h5>
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-mail"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </i>{' '}
                Invite Colleagues
              </h5>
            </div>
            <div className="invitation-meta">
              <p>
                Enter an email address to invite a colleague or co-author to
                join you on socimo. They will receive an email and, in some
                cases, up to two reminders.
              </p>
              <form method="post" className="c-form">
                <input type="text" placeholder="Enter Email" />
                <button type="submit" className="main-btn">
                  Invite
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* invite colleague popup */}
      <div className="popup-wraper">
        <div className="popup">
          <span className="popup-closed">
            <i className="icofont-close" />
          </span>
          <div className="popup-meta">
            <div className="popup-head">
              <h5>
                <i>
                  <svg
                    className="feather feather-message-square"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    height={24}
                    width={24}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </i>{' '}
                Send Message
              </h5>
            </div>
            <div className="send-message">
              <form method="post" className="c-form">
                <input type="text" placeholder="Enter Name.." />
                <input type="text" placeholder="Subject" />
                <textarea placeholder="Write Message" defaultValue={''} />
                <div className="uploadimage">
                  <i className="icofont-file-jpg" />
                  <label className="fileContainer">
                    <input type="file" />
                    Attach file
                  </label>
                </div>
                <button type="submit" className="main-btn">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* send message popup */}
      <div className="side-slide">
        <span className="popup-closed">
          <i className="icofont-close" />
        </span>
        <div className="slide-meta">
          <ul className="nav nav-tabs slide-btns">
            <li className="nav-item">
              <a className="active" href="#messages" data-toggle="tab">
                Tin nhắn
              </a>
            </li>
            <li className="nav-item">
              <a className href="#notifications" data-toggle="tab">
                Tin nhắn mới
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane active fade show" id="messages">
              <h4>
                <i className="icofont-envelope" /> Tin Nhắn
              </h4>
              <a
                href="#"
                className="send-mesg"
                title="New Message"
                data-toggle="tooltip"
              >
                <i className="icofont-edit" />
              </a>
              <ul className="new-messages">
                <li>
                  <figure>
                    <img
                      className="img-new-messages"
                      src="images/avatar/2.jpg"
                      alt
                    />
                  </figure>
                  <div className="mesg-info">
                    <span>Thịnh Nguyễn</span>
                    <a href="#" title>
                      Hệ Thống mình cần làm gì để tạo một chiến dịch ạ?
                    </a>
                  </div>
                </li>
                <li>
                  <figure>
                    <img
                      className="img-new-messages"
                      src="images/avatar/10.jpg"
                      alt
                    />
                  </figure>
                  <div className="mesg-info">
                    <span>Quyền Trần</span>
                    <a href="#" title>
                      Tôi có thể lấy lại tiền donate không
                    </a>
                  </div>
                </li>
                <li>
                  <figure>
                    <img
                      className="img-new-messages"
                      src="images/avatar/20.jpg"
                      alt
                    />
                  </figure>
                  <div className="mesg-info">
                    <span>Huỳnh Phát Tấn</span>
                    <a href="#" title>
                      Hệ Thống Thật Tuyệt vời
                    </a>
                  </div>
                </li>
                {/* <li>
                                    <figure><img src="images/resources/user4.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Saim Turan</span>
                                        <a href="#" title>Helo dear i wanna talk to you</a>
                                    </div>
                                </li>
                                <li>
                                    <figure><img src="images/resources/user5.jpg" alt /></figure>
                                    <div className="mesg-info">
                                        <span>Alis wells</span>
                                        <a href="#" title>Helo dear i wanna talk to you</a>
                                    </div>
                                </li> */}
              </ul>
              <a href="#" title className="main-btn" data-ripple>
                Xem Tất Cả
              </a>
            </div>
            <div className="tab-pane fade" id="notifications">
              <h4>
                <i className="icofont-bell-alt" /> notifications
              </h4>
              <ul className="notificationz">
                <li>
                  <figure>
                    <img src="images/resources/user5.jpg" alt />
                  </figure>
                  <div className="mesg-info">
                    <span>Alis wells</span>
                    <a href="#" title>
                      recommend your post
                    </a>
                  </div>
                </li>
                <li>
                  <figure>
                    <img src="images/resources/user4.jpg" alt />
                  </figure>
                  <div className="mesg-info">
                    <span>Alis wells</span>
                    <a href="#" title>
                      share your post <strong>a good time today!</strong>
                    </a>
                  </div>
                </li>
                <li>
                  <figure>
                    <img src="images/resources/user2.jpg" alt />
                  </figure>
                  <div className="mesg-info">
                    <span>Alis wells</span>
                    <a href="#" title>
                      recommend your post
                    </a>
                  </div>
                </li>
                <li>
                  <figure>
                    <img src="images/resources/user1.jpg" alt />
                  </figure>
                  <div className="mesg-info">
                    <span>Alis wells</span>
                    <a href="#" title>
                      share your post <strong>a good time today!</strong>
                    </a>
                  </div>
                </li>
                <li>
                  <figure>
                    <img src="images/resources/user3.jpg" alt />
                  </figure>
                  <div className="mesg-info">
                    <span>Alis wells</span>
                    <a href="#" title>
                      recommend your post
                    </a>
                  </div>
                </li>
              </ul>
              <a href="#" title className="main-btn" data-ripple>
                view all
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* side slide message & popup */}

      {create === true ? (
        <div className="post-new-popup" style={popupStyle}>
          <div
            className="popupPost"
            style={{
              width: 800,
              zIndex: 80,
              height: '100vh',
              overflowY: 'scroll',
              margin: '1rem',
            }}
          >
            <span className="popup-closed" onClick={handleClick}>
              <i className="icofont-close" />
            </span>
            <div className="popup-meta">
              <div className="popup-head">
                <h5>
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-plus"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                  </i>
                  Tạo chiến dịch
                </h5>
              </div>
            </div>

            <div className="">
              <br />
              <form
                id="survey-form"
                method="post"
                onSubmit={formik.handleSubmit}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Tên chiến dịch
                      </label>
                      <input
                        type="text"
                        name="title"
                        onChange={formik.handleChange}
                        value={formik.values.title}
                        id="name"
                        placeholder="Nhập tên chiến dịch"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="email-label" htmlFor="email">
                        Mô tả chiến dịch
                      </label>
                      <input
                        type="text"
                        name="description"
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        id="email"
                        placeholder="Nhập mô tả"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Ngày bắt đầu
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        onChange={formik.handleChange}
                        value={formik.values.startDate}
                        id="name"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Ngày kết thúc
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        onChange={formik.handleChange}
                        value={formik.values.endDate}
                        id="name"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Nơi diễn ra
                      </label>
                      <input
                        type="text"
                        name="location"
                        onChange={(e) => {
                          formik.handleChange(e);
                          fn(e.target.value);
                        }}
                        value={formik.values.location}
                        id="name"
                        placeholder="Nhập nơi diễn ra"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                        <div className="form-group">
                          {configActivity === "true" ? (
                            <div>
                              <div
                                className="form-group"
                                style={{ display: "flex" }}
                              >
                                <label
                                  id="name-label"
                                  style={{ marginRight: "20px" }}
                                  htmlFor="name"
                                >
                                  Nhận ủng hộ
                                </label>
                                <input
                                  type="checkbox"
                                  onChange={toggleTextInput}
                                />
                              </div>
                              {isTextInputVisible === true && (
                                <div className="form-group">
                                  <input
                                    type="number"
                                    name="targetDonation"
                                    onChange={formik.handleChange}
                                    value={formik.values.targetDonation}
                                    id="name"
                                    placeholder="Nhập số tiền cần nhận"
                                    className="form-control"
                                    style={{ marginTop: "-2rem" }}
                                    required
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                  {/* <div className="col-md-12">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">
                        Lựa chọn
                      </label>
                      <select
                        type="text"
                        name="location"

                        value={formik.values.location}
                        id="name"
                        className="form-control"
                        required
                      >
                        <option>Không nhận donation</option>
                        <option>Có nhận donation</option>
                      </select>
                    </div>
                  </div> */}
                  <div className="col-md-12">
                    <div style={{ height: "200px", width: "100%" }}>
                      <GoogleMapReact
                        bootstrapURLKeys={{
                          key: "AIzaSyBEg-cDilr_ZSqVWMdXNVm4Wn9mo-KOKOI",
                        }}
                        defaultCenter={coords}
                        center={coords}
                        defaultZoom={11}
                      >
                        <AnyReactComponent
                          lat={coords.lat}
                          lng={coords.lng}
                          text={
                            <i
                              class="icofont-location-pin"
                              style={{ fontSize: "3rem", color: "red" }}
                            ></i>
                          }
                        />
                      </GoogleMapReact>
                    </div>
                    
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      {userByID.fanpage?.status === 'Active' && isFanpage ? (
                        <div>
                          <div
                            className="form-group"
                            style={{ display: 'flex' }}
                          >
                            <label
                              id="name-label"
                              style={{ marginRight: '20px' }}
                              htmlFor="name"
                            >
                              Chia sẻ lên nhóm của bạn
                            </label>
                            <input
                              type="checkbox"
                              onChange={toggleTextInput1}
                            // checked={isTextInputVisible1}
                            />
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Hình ảnh</label>
                      <div>
                        <form>
                          <fieldset className="upload_dropZone text-center mb-3 p-4">
                            <legend className="visually-hidden">
                              Tải hình ảnh
                            </legend>
                            <svg
                              className="upload_svg"
                              width={60}
                              height={60}
                              aria-hidden="true"
                            >
                              <use href="#icon-imageUpload" />
                            </svg>
                            <p className="small my-2">
                              Kéo &amp; Thả (các) hình nền bên trong vùng nét
                              đứt
                              <br />
                              <i>hoặc</i>
                            </p>
                            <input
                              id="upload_image_background"
                              // ref={fileInputRef}
                              data-post-name="image_background"
                              data-post-url="https://someplace.com/image/uploads/backgrounds/"
                              className="position-absolute invisible"
                              type="file"
                              multiple
                              onChange={handleImageChange}
                              accept="image/jpeg, image/png, image/svg+xml"
                            />
                            <label
                              className="btn btn-upload mb-3"
                              htmlFor="upload_image_background"
                            >
                              Chọn hình ảnh
                            </label>
                            <div className="upload_gallery d-flex flex-wrap justify-content-center gap-3 mb-0" />
                          </fieldset>
                        </form>
                        <svg style={{ display: 'none' }}>
                          <defs>
                            <symbol
                              id="icon-imageUpload"
                              clipRule="evenodd"
                              viewBox="0 0 96 96"
                            >
                              <path d="M47 6a21 21 0 0 0-12.3 3.8c-2.7 2.1-4.4 5-4.7 7.1-5.8 1.2-10.3 5.6-10.3 10.6 0 6 5.8 11 13 11h12.6V22.7l-7.1 6.8c-.4.3-.9.5-1.4.5-1 0-2-.8-2-1.7 0-.4.3-.9.6-1.2l10.3-8.8c.3-.4.8-.6 1.3-.6.6 0 1 .2 1.4.6l10.2 8.8c.4.3.6.8.6 1.2 0 1-.9 1.7-2 1.7-.5 0-1-.2-1.3-.5l-7.2-6.8v15.6h14.4c6.1 0 11.2-4.1 11.2-9.4 0-5-4-8.8-9.5-9.4C63.8 11.8 56 5.8 47 6Zm-1.7 42.7V38.4h3.4v10.3c0 .8-.7 1.5-1.7 1.5s-1.7-.7-1.7-1.5Z M27 49c-4 0-7 2-7 6v29c0 3 3 6 6 6h42c3 0 6-3 6-6V55c0-4-3-6-7-6H28Zm41 3c1 0 3 1 3 3v19l-13-6a2 2 0 0 0-2 0L44 79l-10-5a2 2 0 0 0-2 0l-9 7V55c0-2 2-3 4-3h41Z M40 62c0 2-2 4-5 4s-5-2-5-4 2-4 5-4 5 2 5 4Z" />
                            </symbol>
                          </defs>
                        </svg>
                      </div>

                      <div className="image-container image-container-flex">
                        {images.map((image, index) => (
                          <div
                            className="image-item image-item-relative"
                            key={index}
                          >
                            <img
                              src={image.url}
                              alt={`Image ${index}`}
                              className="image-preview image-item-flex"
                            />
                            <button
                              className="delete-button"
                              onClick={() => handleImageDelete(index)}
                            >
                              <span>&times;</span>
                            </button>
                          </div>
                        ))}
                      </div>

                      {isLoading && (
                        <div>
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <div className="progress-percentage">
                            {uploadProgress}%
                          </div>
                        </div>
                      )}

                      {files !== '' ? (
                        <img src={files} style={{ height: '300px' }} />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <button
                      type="submit"
                      id="submit"
                      className="btn btn-primary btn-block"
                    >
                      Hoàn thành
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {openpro1 === true ? (
        <div className="post-new-popup" style={popupStyle4}>
          <div
            className="popup"
            style={{ width: 800, marginTop: '100px', zIndex: 80 }}
          >
            <span className="popup-closed" onClick={handleClick6}>
              <i className="icofont-close" />
            </span>
            <div className="popup-meta">
              <div className="popup-head">
                <h5>
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-plus"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                  </i>
                  Chỉnh sửa chiến dịch
                </h5>
              </div>
            </div>

            <div className="">
              <header className="header"></header>
              <div className="form-wrap">
                <form
                  id="survey-form"
                  method="post"
                  onSubmit={formik9.handleSubmit}
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Tên chiến dịch
                        </label>
                        <input
                          type="text"
                          name="title"
                          onChange={formik9.handleChange}
                          value={formik9.values.title}
                          id="name"
                          placeholder="Nhập tên chiến dịch"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="email-label" htmlFor="email">
                          Mô tả chiến dịch
                        </label>
                        <input
                          type="text"
                          name="description"
                          onChange={formik9.handleChange}
                          value={formik9.values.description}
                          id="email"
                          placeholder="Nhập mô tả"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Ngày bắt đầu
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          onChange={formik9.handleChange}
                          value={formik9.values.startDate}
                          id="name"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Ngày kết thúc
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          onChange={formik9.handleChange}
                          value={formik9.values.endDate}
                          id="name"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Nơi diễn ra
                        </label>
                        <input
                          type="text"
                          name="location"
                          onChange={formik9.handleChange}
                          value={formik9.values.location}
                          id="name"
                          placeholder="Nhập nơi diễn ra"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        {configActivity === "true" ? (
                          <div>
                            <div
                              className="form-group"
                              style={{ display: "flex" }}
                            >
                              <label
                                id="name-label"
                                style={{ marginRight: "20px" }}
                                htmlFor="name"
                              >
                                Nhận ủng hộ
                              </label>
                              <input
                                type="checkbox"
                                onChange={toggleTextInput}
                              />
                            </div>
                            {isTextInputVisible === true && (

                                <div className="form-group">

                                  <input
                                    type="number"
                                    name="targetDonation"
                                    onChange={formik9.handleChange}
                                    value={formik9.values.targetDonation}
                                    id="name"
                                    placeholder="Nhập số tiền cần nhận"
                                    className="form-control"
                                    style={{ marginTop: '-2rem' }}
                                    required
                                  />
                                </div>

                            )}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>*/}
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <button
                        type="submit"
                        id="submit"
                        className="btn btn-primary btn-block"
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {
        tt ? (
          <div className="popup-overlay" style={popupStyle9}>
            <div
              className="popup1"
              style={{
                width: 800,
                zIndex: 80,
                height: "800px",
              //  overflowY: "scroll", //#uoc
                marginTop: "50px",
                padding: "10px",
              }}
            >
            <div className="multi-form">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit1}
              >
                <div className="container">
                  <header className="header">
                    {/* <h1 id="title" className="text-center">Survey Form</h1>
                                <p id="description" className="text-center">
                                    Thank you for taking the time to help us improve the platform
                                </p>
                                <button className="close-button" onClick={closePopup}>&times;</button> */}
                  </header>
                  <div className="form-wrap">
                    <Form>
                      <button className="close-button" onClick={closePopup}>
                        &times;
                      </button>
                      <div className="form">
                        {formData.map((form, index) => (
                          <div
                            key={index}
                            className={`form-group  hidden `}
                            style={{ display: index === 0 ? 'none' : 'block' }}
                          >
                            <h3 style={{ textAlign: 'center' }}>
                              Vui lòng điền quy trình {index}
                            </h3>
                            <div className="form-group">
                              <label htmlFor={`processTitle_${index}`}>
                                Tiêu đề
                              </label>
                              <Field
                                type="text"
                                name={`forms[${index}].processTitle`}
                                className="form-control"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor={`description_${index}`}>
                                Mô tả
                              </label>
                              <textarea
                                type="text"
                                name={`forms[${index}].description`}
                                className="form-control"
                              />
                            </div>
                            <dv className="row">
                              <div className="form-group col-md-6">
                                <label htmlFor={`startDate_${index}`}>
                                  Thời gian diễn ra
                                </label>
                                <Field
                                  type="datetime-local"
                                  name={`forms[${index}].startDate`}
                                  className="form-control"
                                />
                              </div>
                              <div className="form-group col-md-6">
                                <label htmlFor={`endDate_${index}`}>
                                  Thời gian kết thúc
                                </label>
                                <Field
                                  type="datetime-local"
                                  name={`forms[${index}].endDate`}
                                  className="form-control"
                                />
                              </div>
                            </dv>

                            <div className="form-group">
                              <label htmlFor={`processTypeId_${index}`}>
                                Thể loại tiến trình
                              </label>
                              <select
                                name={`forms[${index}].processTypeId`}
                                value={form.processTypeId} // Bind the select value to the formData value
                                onChange={(e) => handleSelectChange(e, index)} // Pass the formIndex to handleSelectChange
                                className="form-control"
                              >
                                <option value="">Chọn </option>
                                {processType.map((item, index) => {
                                  return (
                                    <option
                                      value={item.processTypeId}
                                      key={index}
                                    >
                                      {item.processTypeName}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                            <div className="form-group">
                              <Field
                                type="text"
                                hidden
                                name={`forms[${index}].processNo`}
                                value={index + 1}
                                className="form-control"
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor={`media_${index}`}>Hình ảnh</label>
                              <div>
                                <Field
                                  name={`forms[${index}].media`}
                                  id={`media_${index}`}
                                  type="file"
                                  multiple
                                  onChange={(e) => handleImageChange1(e, index)}
                                />
                                <div className="image-container">
                                  {form.media.map((image, imageIndex) => (
                                    <div
                                      className="image-item"
                                      key={imageIndex}
                                    >
                                      <img
                                        src={image.linkMedia}
                                        alt={`Image ${imageIndex}`}
                                        className="image-preview"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {index === currentForm && (
                              <div className="form-buttons">
                                {index > 0 && (
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handlePrevious}
                                  >
                                    Về sau
                                  </button>
                                )}
                                {index < formData.length - 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleNext}
                                  >
                                    Tiếp tục
                                  </button>
                                )}
                                {index > 0 && (
                                  <button
                                    style={{
                                      marginLeft: '1rem',
                                      width: '12%',
                                    }}
                                    type="button"
                                    className="btn btn-danger delete"
                                    onClick={handleDeleteForm}
                                  >
                                    Xóa
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {currentForm === formData.length - 1 && (
                        <div className="form-buttons">
                          <button
                            style={{ width: '25%' }}
                            type="button"
                            className="btn btn-primary"
                            onClick={handleCreateNewForm}
                          >
                            Thêm quy trình
                          </button>
                          {currentForm >= 1 && (
                            <button
                              style={{ marginLeft: '1rem' }}
                              type="submit"
                              className="btn btn-success"
                            >
                              Hoàn thành
                            </button>
                          )}
                        </div>
                      )}
                    </Form>
                  </div>
                </div>
              </Formik>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {report ? (
        <div className="post-new-popup1" style={popupStyle3}>
          <div
            className="popup"
            style={{
              width: 600,
              zIndex: 80,
              height: 450,
              // overflowY: "scroll",
              padding: '10px',
              marginTop: '-100px',
            }}
          >
            <span className="popup-closed" onClick={handleClick3}>
              <i className="icofont-close" />
            </span>
            <div className="popup-meta">
              <div className="popup-head">
                <h5>
                  <i>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-plus"
                    >
                      <line x1={12} y1={5} x2={12} y2={19} />
                      <line x1={5} y1={12} x2={19} y2={12} />
                    </svg>
                  </i>
                  Báo cáo bài viết
                </h5>
              </div>
            </div>
            <div>
              <form onSubmit={formik6.handleSubmit}>
                <div className="form row mt-3">
                  <div className="form-group">
                    <label>Thể loại tiến trình</label>
                    <select
                      value="" // Bind the select value to the formData value
                      onChange={(e) => onInputDropdown(e)} // Pass the formIndex to handleSelectChange
                      className="form-control"
                      placeholder="Chọn loại báo cáo"
                    >
                      <option value="">Chọn loại báo cáo</option>
                      {arrReportType.map((item, index) => {
                        return (
                          <option value={item.value} key={index}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Lý do</label>
                    <textarea
                      id="message"
                      className="form-control"
                      rows="2"
                      cols="50"
                      name="reason"
                      onChange={formik6.handleChange}
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                      >
                        Báo cáo
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {/* {isOpen2 === true ?
                <div className="post-new-popup2" style={popupStyle2}>
                    <div className="popup" style={{ width: 800, marginTop: '100px', zIndex: 80 }}>
                        <span className="popup-closed" onClick={handleClick2}><i className="icofont-close" /></span>
                        <div className="popup-meta">
                            <div className="popup-head">
                                <h5><i>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus">
                                        <line x1={12} y1={5} x2={12} y2={19} />
                                        <line x1={5} y1={12} x2={19} y2={12} />
                                    </svg></i>Xem Tiến Trình</h5>
                            </div>
                        </div>

                        <div className="form">
                            <header className="header">

                            </header>
                            <div className="form-wrap">
                                {processactivity.map((item, index) => {
                                    return <div>
                                    </div>
                                }
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                :
                <div></div>
            } */}

      <div className="new-question-popup">
        <div className="popup">
          <span className="popup-closed">
            <i className="icofont-close" />
          </span>
          <div className="popup-meta">
            <div className="popup-head">
              <h5>
                <i>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-help-circle"
                  >
                    <circle cx={12} cy={12} r={10} />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1={12} y1={17} x2="12.01" y2={17} />
                  </svg>
                </i>{' '}
                Ask Question
              </h5>
            </div>
            <div className="post-new">
              <form method="post" className="c-form">
                <input type="text" placeholder="Question Title" />
                <textarea placeholder="Write Question" defaultValue={''} />
                <select>
                  <option>Select Your Question Type</option>
                  <option>Article</option>
                  <option>Book</option>
                  <option>Chapter</option>
                  <option>Code</option>
                  <option>conference Paper</option>
                  <option>Cover Page</option>
                  <option>Data</option>
                  <option>Exprement Finding</option>
                  <option>Method</option>
                  <option>Poster</option>
                  <option>Preprint</option>
                  <option>Technicial Report</option>
                  <option>Thesis</option>
                  <option>Research</option>
                </select>
                <div className="uploadimage">
                  <i className="icofont-eye-alt-alt" />
                  <label className="fileContainer">
                    <input type="file" />
                    Upload File
                  </label>
                </div>
                <button type="submit" className="main-btn">
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="share-wraper">
        <div className="share-options">
          <span className="close-btn">
            <i className="icofont-close-circled" />
          </span>
          <h5>
            <i>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-share"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1={12} y1={2} x2={12} y2={15} />
              </svg>
            </i>
            Share To!
          </h5>
          <form method="post">
            <textarea placeholder="Write Something" defaultValue={''} />
          </form>
          <ul>
            <li>
              <a title href="#">
                Your Timeline
              </a>
            </li>
            <li className="friends">
              <a title href="#">
                To Friends
              </a>
            </li>
            <li className="socialz">
              <a className="active" title href="#">
                Social Media
              </a>
            </li>
          </ul>
          <div style={{ display: 'block' }} className="social-media">
            <ul>
              <li>
                <a title href="#" className="facebook">
                  <i className="icofont-facebook" />
                </a>
              </li>
              <li>
                <a title href="#" className="twitter">
                  <i className="icofont-twitter" />
                </a>
              </li>
              <li>
                <a title href="#" className="instagram">
                  <i className="icofont-instagram" />
                </a>
              </li>
              <li>
                <a title href="#" className="pinterest">
                  <i className="icofont-pinterest" />
                </a>
              </li>
              <li>
                <a title href="#" className="youtube">
                  <i className="icofont-youtube" />
                </a>
              </li>
              <li>
                <a title href="#" className="dribble">
                  <i className="icofont-dribbble" />
                </a>
              </li>
              <li>
                <a title href="#" className="behance">
                  <i className="icofont-behance-original" />
                </a>
              </li>
            </ul>
          </div>
          <div style={{ display: 'none' }} className="friends-to">
            <div className="follow-men">
              <figure>
                <img
                  className="mCS_img_loaded"
                  src="images/resources/user1.jpg"
                  alt
                />
              </figure>
              <div className="follow-meta">
                <h5>
                  <a href="#" title>
                    Jack Carter
                  </a>
                </h5>
                <span>family member</span>
              </div>
              <a href="#" title>
                Share
              </a>
            </div>
            <div className="follow-men">
              <figure>
                <img
                  className="mCS_img_loaded"
                  src="images/resources/user2.jpg"
                  alt
                />
              </figure>
              <div className="follow-meta">
                <h5>
                  <a href="#" title>
                    Xang Ching
                  </a>
                </h5>
                <span>Close Friend</span>
              </div>
              <a href="#" title>
                Share
              </a>
            </div>
            <div className="follow-men">
              <figure>
                <img
                  className="mCS_img_loaded"
                  src="images/resources/user3.jpg"
                  alt
                />
              </figure>
              <div className="follow-meta">
                <h5>
                  <a href="#" title>
                    Emma Watson
                  </a>
                </h5>
                <span>Matul Friend</span>
              </div>
              <a href="#" title>
                Share
              </a>
            </div>
          </div>
          <button type="submit" className="main-btn">
            Publish
          </button>
        </div>
      </div>
      
      {/* view cart button */}
      <div className="chat-live">
        <a
          className="chat-btn"
          href="#"
          title="Start Live Chat"
          data-toggle="tooltip"
        >
          <i className="icofont-facebook-messenger" />
        </a>
        <span>07</span>
      </div>
      {/* chat button */}
      <div className="chat-box">
        <div className="chat-head">
          <h4>New Messages</h4>
          <span className="clozed">
            <i className="icofont-close-circled" />
          </span>
          <form method="post">
            <input type="text" placeholder="To.." />
          </form>
        </div>
        <div className="user-tabs">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="active" href="#link1" data-toggle="tab">
                All Friends
              </a>
            </li>
            <li className="nav-item">
              <a className href="#link2" data-toggle="tab">
                Active
              </a>
              <em>3</em>
            </li>
            <li className="nav-item">
              <a className href="#link3" data-toggle="tab">
                Groups
              </a>
            </li>
          </ul>
          {/* Tab panes */}
          <div className="tab-content">
            <div className="tab-pane active fade show " id="link1">
              <div className="friend">
                <a href="#" title>
                  <figure>
                    <img src="images/resources/user1.jpg" alt />
                    <span className="status online" />
                  </figure>
                  <span>Oliver</span>
                  <i className>
                    <img src="images/resources/user1.jpg" alt />
                  </i>
                </a>
                <a href="#" title>
                  <figure>
                    <img src="images/resources/user2.jpg" alt />
                    <span className="status away" />
                  </figure>
                  <span>Amelia</span>
                  <i className="icofont-check-circled" />
                </a>
                <a href="#" title>
                  <figure>
                    <img src="images/resources/user3.jpg" alt />
                    <span className="status offline" />
                  </figure>
                  <span>George</span>
                  <i className>
                    <img src="images/resources/user3.jpg" alt />
                  </i>
                </a>
                <a href="#" title>
                  <figure>
                    <img src="images/resources/user4.jpg" alt />
                    <span className="status online" />
                  </figure>
                  <span>Jacob</span>
                  <i className="icofont-check-circled" />
                </a>
                <a href="#" title>
                  <figure>
                    <img src="images/resources/user5.jpg" alt />
                    <span className="status away" />
                  </figure>
                  <span>Poppy</span>
                  <i className="icofont-check-circled" />
                </a>
                <a href="#" title>
                  <figure>
                    <img src="images/resources/user6.jpg" alt />
                    <span className="status online" />
                  </figure>
                  <span>Sophia</span>
                  <i className>
                    <img src="images/resources/user6.jpg" alt />
                  </i>
                </a>
                <a href="#" title>
                  <figure>
                    <img src="images/resources/user7.jpg" alt />
                    <span className="status away" />
                  </figure>
                  <span>Leo king</span>
                  <i className>
                    <img src="images/resources/user7.jpg" alt />
                  </i>
                </a>
              </div>
            </div>
            <div className="tab-pane fade" id="link2">
              <div className="friend">
                <a href="#" title>
                  <figure>
                    <img src="images/resources/user1.jpg" alt />
                    <span className="status online" />
                  </figure>
                  <span>Samu Jane</span>
                  <i className>
                    <img src="images/resources/user1.jpg" alt />
                  </i>
                </a>
                <a href="#" title>
                  <figure>
                    <img src="images/resources/user6.jpg" alt />
                    <span className="status online" />
                  </figure>
                  <span>Tina Mark</span>
                  <i className>
                    <img src="images/resources/user6.jpg" alt />
                  </i>
                </a>
                <a href="#" title>
                  <figure>
                    <img src="images/resources/user7.jpg" alt />
                    <span className="status online" />
                  </figure>
                  <span>Ak William</span>
                  <i className>
                    <img src="images/resources/user7.jpg" alt />
                  </i>
                </a>
              </div>
            </div>
            <div className="tab-pane fade" id="link3">
              <div className="friend">
                <a href="#" title>
                  <figure className="group-chat">
                    <img src="images/resources/user5.jpg" alt />
                    <img className="two" src="images/resources/user3.jpg" alt />
                    <span className="status online" />
                  </figure>
                  <span>Boys World</span>
                  <i className="icofont-check-circled" />
                </a>
                <a href="#" title>
                  <figure className="group-chat">
                    <img src="images/resources/user2.jpg" alt />
                    <img className="two" src="images/resources/user3.jpg" alt />
                    <span className="status online" />
                  </figure>
                  <span>KK university Fellows</span>
                  <i className="icofont-check-circled" />
                </a>
                <a href="#" title>
                  <figure className="group-chat">
                    <img src="images/resources/user3.jpg" alt />
                    <img className="two" src="images/resources/user2.jpg" alt />
                    <span className="status away" />
                  </figure>
                  <span>Education World</span>
                  <i className="icofont-check-circled" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="chat-card">
          <div className="chat-card-head">
            <img src="images/resources/user13.jpg" alt />
            <h6>George Floyd</h6>
            <div className="frnd-opt">
              <div className="more">
                <div className="more-post-optns">
                  <i className>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-more-horizontal"
                    >
                      <circle cx={12} cy={12} r={1} />
                      <circle cx={19} cy={12} r={1} />
                      <circle cx={5} cy={12} r={1} />
                    </svg>
                  </i>
                  <ul>
                    <li>
                      <i className="icofont-pen-alt-1" />
                      Edit Post
                      <span>Edit This Post within a Hour</span>
                    </li>
                    <li>
                      <i className="icofont-ban" />
                      Hide Chat
                      <span>Hide This Post</span>
                    </li>
                    <li>
                      <i className="icofont-ui-delete" />
                      Delete Chat
                      <span>If inappropriate Post By Mistake</span>
                    </li>
                    <li>
                      <i className="icofont-flag" />
                      Report
                      <span>Inappropriate Chat</span>
                    </li>
                  </ul>
                </div>
              </div>
              <span className="close-mesage">
                <i className="icofont-close" />
              </span>
            </div>
          </div>
          <div className="chat-list">
            <ul>
              <li className="me">
                <div className="chat-thumb">
                  <img src="images/resources/chatlist1.jpg" alt />
                </div>
                <div className="notification-event">
                  <div className="chat-message-item">
                    <figure>
                      <img src="images/resources/album5.jpg" alt />
                    </figure>
                    <div className="caption">
                      4.5kb <i className="icofont-download" title="Download" />
                    </div>
                  </div>
                  <span className="notification-date">
                    <time
                      dateTime="2004-07-24T18:18"
                      className="entry-date updated"
                    >
                      Yesterday at 8:10pm
                    </time>
                    <i>
                      <img src="images/d-tick.png" alt />
                    </i>
                  </span>
                </div>
              </li>
              <li className="me">
                <div className="chat-thumb">
                  <img src="images/resources/chatlist1.jpg" alt />
                </div>
                <div className="notification-event">
                  <span className="chat-message-item">
                    Hi James! Please remember to buy the food for tomorrow! I’m
                    gonna be handling the gifts and Jake’s gonna get the drinks
                  </span>
                  <span className="notification-date">
                    <time
                      dateTime="2004-07-24T18:18"
                      className="entry-date updated"
                    >
                      Yesterday at 8:10pm
                    </time>
                    <i>
                      <img src="images/d-tick.png" alt />
                    </i>
                  </span>
                </div>
              </li>
              <li className="you">
                <div className="chat-thumb">
                  <img src="images/resources/chatlist2.jpg" alt />
                </div>
                <div className="notification-event">
                  <span className="chat-message-item">
                    Hi James! Please remember to buy the food for tomorrow! I’m
                    gonna be handling the gifts and Jake’s gonna get the drinks
                  </span>
                  <span className="notification-date">
                    <time
                      dateTime="2004-07-24T18:18"
                      className="entry-date updated"
                    >
                      Yesterday at 8:10pm
                    </time>
                    <i>
                      <img src="images/d-tick.png" alt />
                    </i>
                  </span>
                </div>
              </li>
              <li className="me">
                <div className="chat-thumb">
                  <img src="images/resources/chatlist1.jpg" alt />
                </div>
                <div className="notification-event">
                  <span className="chat-message-item">
                    Hi James! Please remember to buy the food for tomorrow! I’m
                    gonna be handling the gifts and Jake’s gonna get the drinks
                  </span>
                  <span className="notification-date">
                    <time
                      dateTime="2004-07-24T18:18"
                      className="entry-date updated"
                    >
                      Yesterday at 8:10pm
                    </time>
                    <i>
                      <img src="images/d-tick.png" alt />
                    </i>
                  </span>
                </div>
              </li>
            </ul>
            <form className="text-box">
              <textarea placeholder="Write Mesage..." defaultValue={''} />
              <div className="add-smiles">
                <span>
                  <img src="images/smiles/happy-3.png" alt />
                </span>
              </div>
              <div className="smiles-bunch">
                <i>
                  <img src="images/smiles/thumb.png" alt />
                </i>
                <i>
                  <img src="images/smiles/angry-1.png" alt />
                </i>
                <i>
                  <img src="images/smiles/angry.png" alt />
                </i>
                <i>
                  <img src="images/smiles/bored-1.png" alt />
                </i>
                <i>
                  <img src="images/smiles/confused-1.png" alt />
                </i>
                <i>
                  <img src="images/smiles/wink.png" alt />
                </i>
                <i>
                  <img src="images/smiles/weep.png" alt />
                </i>
                <i>
                  <img src="images/smiles/tongue-out.png" alt />
                </i>
                <i>
                  <img src="images/smiles/suspicious.png" alt />
                </i>
                <i>
                  <img src="images/smiles/crying-1.png" alt />
                </i>
                <i>
                  <img src="images/smiles/crying.png" alt />
                </i>
                <i>
                  <img src="images/smiles/embarrassed.png" alt />
                </i>
                <i>
                  <img src="images/smiles/emoticons.png" alt />
                </i>
                <i>
                  <img src="images/smiles/happy-2.png" alt />
                </i>
              </div>
              <button type="submit">
                <i className="icofont-paper-plane" />
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* chat box */}
      <div className="createroom-popup">
        <div className="popup">
          <span className="popup-closed">
            <i className="icofont-close" />
          </span>
          <div className="popup-meta">
            <div className="popup-head text-center">
              <h5 className="only-icon">
                <i className="icofont-video-cam" />
              </h5>
            </div>
            <div className="room-meta">
              <h4>Create Your Room</h4>
              <ul>
                <li>
                  <i className="icofont-hand" />
                  <div>
                    <h6>Room Activity</h6>
                    <span>Jack's Room</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" id="checkbox3" />
                    <label htmlFor="checkbox3" />
                  </div>
                </li>
                <li>
                  <i className="icofont-clock-time" />
                  <div>
                    <h6>Start Time</h6>
                    <span>Now</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" id="checkbox4" />
                    <label htmlFor="checkbox4" />
                  </div>
                </li>
                <li>
                  <i className="icofont-users-alt-4" />
                  <div>
                    <h6>Invite to All Friends</h6>
                    <span>Allow All friends to see this room</span>
                  </div>
                  <div className="checkbox">
                    <input type="checkbox" id="checkbox5" />
                    <label htmlFor="checkbox5" />
                  </div>
                </li>
              </ul>
              <span>
                Your room isn't visible until you invite people after you've
                created it.
              </span>
              <a href="#" title className="main-btn full-width">
                Create Room
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* create new room */}
      <DetailActivity item={detail} dateTime={DateTime} />

      <div
        className="modal fade"
        id="popupModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="popupModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <form
            className="modal-content"
            method="post"
            onSubmit={formik1.handleSubmit}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="popupModalLabel">
                Ủng Hộ
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="name">Tiêu Đề:</label>
                  <input
                    type="text"
                    id="name"
                    name="title"
                    onChange={formik1.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Số Tiền:</label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    onChange={formik1.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Email:</label>
                  <input
                    type="text"
                    id="email"
                    value="email"
                    name="email"
                    onChange={formik1.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Số Điện Thoại:</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    onChange={formik1.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Họ Tên:</label>
                  <input
                    type="text"
                    id="name"
                    value="name"
                    name="name"
                    onChange={formik1.handleChange}
                  />
                </div>
                <button type="submit" className="">
                  Submit
                </button>
              </form>
            </div>
          </form>
        </div>
      </div>
      {isPopupOpen && (
        <div className="popup-overlay">
          {/* <div className="popup-container"> */}
          {/* <h2>Popup Form</h2> */}

          <div className="container">
            <header className="header">
              {/* <h1 id="title" className="text-center">Survey Form</h1>
                                <p id="description" className="text-center">
                                    Thank you for taking the time to help us improve the platform
                                </p>
                                <button className="close-button" onClick={closePopup}>&times;</button> */}
              </header>
              <div className="form-wrap">
                <form
                  id="survey-form"
                  onSubmit={formik1.handleSubmit}
                  method="post"
                >
                  <h1 id="title" className="text-center">
                    Vui lòng điền thông tin của bạn
                  </h1>
                  <button className="close-button" onClick={closePopup}>
                    &times;
                  </button>
                  <div className="row ">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Nội dung:
                        </label>
                        <input
                          type="text"
                          name="title"
                          onChange={formik1.handleChange}
                          id="name"
                          placeholder="Nhập nội dung"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="email-label" htmlFor="email">
                          Số tiền:
                        </label>
                        <input
                          type="number"
                          name="amount"
                          onChange={formik1.handleChange}
                          id="email"
                          placeholder="Nhập số tiền"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Email:
                        </label>
                        <input
                        disabled
                          type="email"
                          value={formik1.values.email}
                          name="email"
                          onChange={formik1.handleChange}
                          id="validationDefault01"
                          placeholder="Nhập email"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="email-label" htmlFor="email">
                          Số điện thoại:
                        </label>
                        <input
                          type="text"
                          name="phone"
                          onChange={formik1.handleChange}
                          id="email"
                          placeholder="Nhập số điện thoại"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label id="name-label" htmlFor="name">
                          Họ tên:
                        </label>
                        <input
                        // disable: không cho chỉnh sửa
                        disabled
                          type="text"
                          name="name"
                          value={formik1.values.name}
                          onChange={formik1.handleChange}
                          id="name"
                          placeholder="Họ và tên"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>

                <div className="row">
                  <div className="col-md-4">
                    <button
                      type="submit"
                      id="submit"
                      className="btn btn-primary btn-block"
                    >
                      Hoàn thành
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* </div> */}
        </div>
      )}
    </Fragment>
  );
}
