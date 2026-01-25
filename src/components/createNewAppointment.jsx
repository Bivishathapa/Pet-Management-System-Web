import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVets } from '../thunks/listVetsThunk';
import { fetchGroomers } from '../thunks/listGroomersThunk';
import { createAppointment } from '../thunks/createAppointmentThunk';
import { resetAppointmentState } from '../feature/createAppointmentSlice';
import { isProfessionalAvailableForListing } from '../utils/professionalAvailability';

export const createNewAppointment = (options = {}) => {
  const {
    guestMode = false,
    initialType = '',
    initialProfessionalId = '',
    onGuestSubmit,
  } = options;
  const dispatch = useDispatch();
  
  const { vets = [], loading: vetsLoading } = useSelector((state) => state.vets);
  const { groomers = [], loading: groomersLoading } = useSelector((state) => state.groomers);
  const { loading: createLoading, error: createError, success } = useSelector((state) => state.createAppointment);
  const { userDetails } = useSelector((state) => state.userDetails);
  const authState = useSelector((state) => state.auth);
  const userData = authState?.user?.data || authState?.user;
  const petFromAuth = userData?.pet;
  const petsFromDetails = userDetails?.pets || [];
  const userPets = petsFromDetails.length > 0 
    ? petsFromDetails.map(pet => ({
        id: pet.id,
        name: pet.name || 'Pet',
        species: pet.breeds?.species || pet.species || 'Unknown',
        breed: pet.breeds?.name || pet.breed || 'Unknown',
        age: pet.age || 0
      }))
    : petFromAuth 
      ? [{
          id: petFromAuth.id,
          name: petFromAuth.name || 'Pet',
          species: petFromAuth.species || 'Unknown',
          breed: petFromAuth.breed || 'Unknown',
          age: petFromAuth.age || 0
        }]
      : [];

  const guestPets = [{ id: -1, name: 'Guest Pet', species: 'Pet', breed: 'Details not added', age: 0 }];
  const availablePets = guestMode ? guestPets : userPets;

  const [formData, setFormData] = useState({
    appointmentType: initialType || '',
    date: '',
    time: '',
    professionalId: initialProfessionalId ? Number(initialProfessionalId) : '',
    petId: guestMode ? -1 : '',
    description: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const appointmentTypes = [
    { value: 'veterinary', label: 'Veterinary Consultation', icon: '🏥', backendValue: 'veterinary consultation' },
    { value: 'grooming', label: 'Grooming Service', icon: '✂️', backendValue: 'grooming service' },
    { value: 'vaccination', label: 'Vaccination', icon: '💉', backendValue: 'vaccination' },
    { value: 'checkup', label: 'General Check-up', icon: '🩺', backendValue: 'general consultation' }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  useEffect(() => {
    dispatch(fetchVets());
    dispatch(fetchGroomers());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowSuccessModal(true);
    }
  }, [success, dispatch]);

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setFormData({
      appointmentType: '',
      date: '',
      time: '',
      professionalId: '',
      petId: '',
      description: ''
    });
    setCurrentStep(1);
    dispatch(resetAppointmentState());
  };

  useEffect(() => {
    if (createError) {
      alert(`Error: ${createError}`);
    }
  }, [createError]);

  useEffect(() => {
    if (formData.appointmentType === 'veterinary' || 
        formData.appointmentType === 'vaccination' || 
        formData.appointmentType === 'checkup') {
      const transformed = Array.isArray(vets) ? vets.map(vet => ({
        id: vet.id,
        name: vet.users?.name || 'Unknown',
        specialty: vet.specialization,
        rating: typeof vet.rating === 'number' ? vet.rating : null,
        experience: `${vet.experienceYears} years`,
        avatar: (vet.users?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase(),
        available: isProfessionalAvailableForListing(vet),
        type: 'vet'
      })) : [];
      setFilteredProfessionals(transformed);
    } else if (formData.appointmentType === 'grooming') {
      const transformed = Array.isArray(groomers) ? groomers.map(groomer => ({
        id: groomer.id,
        name: groomer.users?.name || 'Unknown',
        specialty: groomer.specialization,
        rating: typeof groomer.rating === 'number' ? groomer.rating : null,
        experience: `${groomer.experienceYears} years`,
        avatar: (groomer.users?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase(),
        available: isProfessionalAvailableForListing(groomer),
        type: 'groomer'
      })) : [];
      setFilteredProfessionals(transformed);
    } else {
      setFilteredProfessionals([]);
    }
  }, [formData.appointmentType, vets, groomers]);

  const searchedProfessionals = filteredProfessionals.filter(prof => 
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (guestMode) {
      if (onGuestSubmit) {
        onGuestSubmit();
      }
      return;
    }

    if (!formData.petId) {
      alert('Please select a pet');
      return;
    }

    const appointmentTypeObj = appointmentTypes.find(t => t.value === formData.appointmentType);
    const backendAppointmentType = appointmentTypeObj?.backendValue || formData.appointmentType;
    const selectedProfessional = filteredProfessionals.find(p => p.id === formData.professionalId);
    let serviceType;
    if (formData.appointmentType === 'grooming') {
      serviceType = 'grooming';
    } else {
      serviceType = 'vet';
    }

    const time24Hour = formData.time.replace(/\s?(AM|PM)/, '').trim();
    const requestBody = {
      petId: parseInt(formData.petId),
      serviceType: serviceType,
      appointmentType: backendAppointmentType,
      appointmentDate: formData.date,
      time: time24Hour,
      description: formData.description || null,
    };

    if (selectedProfessional?.type === 'vet') {
      requestBody.vetId = parseInt(formData.professionalId);
    } else if (selectedProfessional?.type === 'groomer') {
      requestBody.groomerId = parseInt(formData.professionalId);
    }

    try {
      await dispatch(createAppointment({
        appointmentData: requestBody
      })).unwrap();
    } catch (error) {
      console.error('Failed to create appointment:', error);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) return guestMode ? true : formData.petId !== '';
    if (currentStep === 2) return formData.appointmentType !== '';
    if (currentStep === 3) return formData.date !== '' && formData.time !== '';
    if (currentStep === 4) return formData.professionalId !== '';
    return false;
  };

  return {
    formData,
    currentStep,
    searchTerm,
    userPets: availablePets,
    appointmentTypes,
    timeSlots,
    searchedProfessionals,
    showSuccessModal,
    vetsLoading,
    groomersLoading,
    createLoading,
    handleInputChange,
    handleNext,
    handlePrevious,
    handleSubmit,
    setSearchTerm,
    isStepValid,
    handleModalClose
  };
};