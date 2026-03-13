import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBreeds } from '../thunks/getAnimalBreedThunk';
import { registerUser } from '../thunks/registerUserThunk';
import { resetRegisterState } from '../feature/registerUserSlice';

export default function useUserRegistration(onNavigateToLogin) {
  const dispatch = useDispatch();
  const { speciesList, breedsBySpecies, loading: breedsLoading, error: breedsError } = useSelector((state) => state.breed);
  const { loading: registerLoading, error: registerError, success } = useSelector((state) => state.register);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    species: '',
    breed: '',
    age: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    dispatch(fetchBreeds());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setShowSuccessModal(true);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        species: '',
        breed: '',
        age: ''
      });
    }
  }, [success]);

  const handleModalClose = () => {
    setShowSuccessModal(false);
    
    dispatch(resetRegisterState());
    
    onNavigateToLogin();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (validationError) {
      setValidationError('');
    }
    
    if (name === 'species') {
      setFormData({
        ...formData,
        species: value,
        breed: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setValidationError('Please enter your full name');
      return false;
    }
    
    if (!formData.email.trim()) {
      setValidationError('Please enter your email address');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return false;
    }

    if (!formData.phone.trim()) {
      setValidationError('Please enter your phone number');
      return false;
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setValidationError('Please enter a valid phone number');
      return false;
    }
    
    if (!formData.password) {
      setValidationError('Please enter a password');
      return false;
    }
    
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return false;
    }
    
    if (!formData.species) {
      setValidationError('Please select a pet species');
      return false;
    }
    
    if (!formData.breed) {
      setValidationError('Please select a breed');
      return false;
    }
    
    if (!formData.age) {
      setValidationError('Please enter your pet\'s age');
      return false;
    }
    
    const age = parseFloat(formData.age);
    if (isNaN(age) || age < 0) {
      setValidationError('Please enter a valid age (must be 0 or greater)');
      return false;
    }
    
    if (age > 50) {
      setValidationError('Please enter a realistic age (maximum 50 years)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validateForm()) {
      return;
    }
    
    const registrationData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
      breedId: parseInt(formData.breed),
      age: parseFloat(formData.age) 
    };
    
    dispatch(registerUser(registrationData));
  };

  const availableBreeds = formData.species && breedsBySpecies[formData.species] 
    ? breedsBySpecies[formData.species] 
    : [];

  const displayError = validationError || registerError || breedsError;
  const isLoading = breedsLoading || registerLoading;

  return {
    formData,
    showPassword,
    setShowPassword,
    displayError,
    success,
    isLoading,
    breedsLoading,
    registerLoading,
    speciesList,
    availableBreeds,
    handleChange,
    handleSubmit,
    showSuccessModal,
    handleModalClose
  };
}