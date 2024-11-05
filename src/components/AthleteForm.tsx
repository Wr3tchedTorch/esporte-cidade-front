import "./AthleteForm.css";
import React, { useState } from "react";

interface Athlete {
  id: number;
  name: string;
  cpf: string;
  rg: string;
  address: string;
  fatherName: string;
  motherName: string;
  birthDate: Date;
  phoneNumber: string;
  attendances: Attendance[];
  modalities: Modality[];
  password: string;
  email: string;
  responsibleName: string;
  responsibleEmail: string;
  motherPhoneNumber: string;
  fatherPhoneNumber: string;
  bloodType: string;
  frontIdPhotoUrl: string;
  backIdPhotoUrl: string;
  athletePhotoUrl: string;
  foodAllergies: string;
}

interface Attendance {
  // ...
}

interface Modality {
  // ...
}

const AthleteForm: React.FC = () => {
  const [athlete, setAthlete] = useState<Athlete>({
    id: 0,
    name: "",
    cpf: "",
    rg: "",
    address: "",
    fatherName: "",
    motherName: "",
    birthDate: new Date(),
    phoneNumber: "",
    attendances: [],
    modalities: [],
    password: "",
    email: "",
    responsibleName: "",
    responsibleEmail: "",
    motherPhoneNumber: "",
    fatherPhoneNumber: "",
    bloodType: "",
    frontIdPhotoUrl: "",
    backIdPhotoUrl: "",
    athletePhotoUrl: "",
    foodAllergies: "",
  });
  const [frontIdPhoto, setFrontIdPhoto] = useState<File | null>(null);
  const [backIdPhoto, setBackIdPhoto] = useState<File | null>(null);
  const [athletePhoto, setAthletePhoto] = useState<File | null>(null);
  const [formStep, setFormStep] = useState<number>(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAthlete({ ...athlete, [name]: value });
    validateField( name, value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAthlete({ ...athlete, [name]: new Date(value) });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = event.target.files?.[0] || null;
    setFile(file);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (value.trim() === '') error = 'Nome é obrigatório.';
        break;
      case 'cpf':
        if (!/^\d{11}$/.test(value)) error = 'CPF deve ter exatamente 11 dígitos.';
        break;
      case 'rg':
        if (!/^\d+$/.test(value) || value.trim() === '') error = 'RG deve conter apenas números.';
        break;
      case 'email':
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) error = 'Email inválido.';
        break;
      case 'phoneNumber':
        if (!/^\d{10,11}$/.test(value)) error = 'Telefone deve ter entre 10 e 11 dígitos.';
        break;
      case 'password':
        if (value.length < 8) error = 'Senha deve ter pelo menos 8 caracteres.';
        break;
      case 'birthDate':
        const birthDate = new Date(value);
        if (birthDate > new Date()) error = 'Data de nascimento não pode ser no futuro.';
        if (birthDate.getFullYear() < 1900) error = 'Data de nascimento não pode ser anterior a 1900.';
        break;
      case 'responsibleName':
        if (value.trim() === '') error = 'Nome do responsável é obrigatório.';
        break;
      case 'responsibleEmail':
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) error = 'Email do responsável inválido.';
        break;
      case 'motherPhoneNumber':
        if (!/^\d{10,11}$/.test(value)) error = 'Telefone da mãe deve ter entre 10 e 11 dígitos.';
        break;
      case 'fatherPhoneNumber':
        if (!/^\d{10,11}$/.test(value)) error = 'Telefone do pai deve ter entre 10 e 11 dígitos.';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateStep = (): boolean => {
    switch (formStep) {
      case 1:
        return athlete.name !== '' && athlete.cpf.length === 11 && athlete.rg !== '' && !!athlete.birthDate;
      case 2:
        return athlete.phoneNumber !== '' && athlete.email !== '' && athlete.responsibleName !== '' && athlete.responsibleEmail !== '';
      case 3:
        return frontIdPhoto !== null && backIdPhoto !== null && athletePhoto !== null;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setFormStep((prevStep) => prevStep + 1);
    } else {
      alert('Por favor, preencha todos os campos obrigatórios corretamente antes de prosseguir.');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(athlete);
  };

  const isNextButtonDisabled = () => {
    if (formStep === 1) {
      return !(athlete.name && athlete.cpf.length === 11 && athlete.rg && athlete.birthDate && !errors.name && !errors.cpf && !errors.rg && !errors.birthDate);
    }
    if (formStep === 2) {
      return !(athlete.phoneNumber && athlete.email && athlete.responsibleName && athlete.responsibleEmail && !errors.phoneNumber && !errors.email && !errors.responsibleName && !errors.responsibleEmail);
    }
    if (formStep === 3) {
      return !(frontIdPhoto && backIdPhoto && athletePhoto);
    }
    return true;
  };

  return (
    <div>
      <div className="steps">
        <div className={`step ${formStep === 1 ? 'active' : ''}`}>1. Informações Pessoais</div>
        <div className={`step ${formStep === 2 ? 'active' : ''}`}>2. Contato e Responsáveis</div>
        <div className={`step ${formStep === 3 ? 'active' : ''}`}>3. Documentação e Saúde</div>
      </div>
      <form onSubmit={handleSubmit}>
        {formStep === 1 && (
          <div>
            <h2>Informações Pessoais</h2>
            <label>Nome <span className="required">*</span>:</label>
            <input type="text" name="name" value={athlete.name} onChange={handleChange} required />
            {errors.name && <span className="error">{errors.name}</span>}
            <label>CPF <span className="required">*</span>:</label>
            <input type="text" name="cpf" value={athlete.cpf} onChange={handleChange} required />
            {errors.cpf && <span className="error">{errors.cpf}</span>}
            <label>RG <span className="required">*</span>:</label>
            <input type="text" name="rg" value={athlete.rg} onChange={handleChange} required />
            {errors.rg && <span className="error">{errors.rg}</span>}
            <label>Data de Nascimento <span className="required">*</span>:</label>
            <input type="date" name="birthDate" value={athlete.birthDate.toISOString().split('T')[0]} onChange={handleDateChange} required />
            {errors.birthDate && <span className="error">{errors.birthDate}</span>}
            <button type="button" onClick={handleNextStep} disabled={isNextButtonDisabled()}> Próximo </button>
          </div>
        )}
        {formStep === 2 && (
          <div>
            <h2>Informações de Contato e Responsáveis</h2>
            <label>Telefone <span className="required">*</span>:</label>
            <input type="text" name="phoneNumber" value={athlete.phoneNumber} onChange={handleChange} required />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
            <label>Email <span className="required">*</span>:</label>
            <input type="email" name="email" value={athlete.email} onChange={handleChange} required />
            {errors.email && <span className="error">{errors.email}</span>}
            <label>Nome do Responsável <span className="required">*</span>:</label>
            <input type="text" name="responsibleName" value={athlete.responsibleName} onChange={handleChange} required />
            {errors.responsibleName && <span className="error">{errors.responsibleName}</span>}
            <label>Email do Responsável <span className="required">*</span>:</label>
            <input type="email" name="responsibleEmail" value={athlete.responsibleEmail} onChange={handleChange} required />
            {errors.responsibleEmail && <span className="error">{errors.responsibleEmail}</span>}
            <label>Telefone da Mãe <span className="required">*</span>:</label>
            <input type="text" name="motherPhoneNumber" value={athlete.motherPhoneNumber} onChange={handleChange} required />
            {errors.motherPhoneNumber && <span className="error">{errors.motherPhoneNumber}</span>}
            <label>Telefone do Pai <span className="required">*</span>:</label>
            <input type="text" name="fatherPhoneNumber" value={athlete.fatherPhoneNumber} onChange={handleChange} required />
            {errors.fatherPhoneNumber && <span className="error">{errors.fatherPhoneNumber}</span>}
            <button type="button" onClick={handleNextStep} disabled={isNextButtonDisabled()}> Próximo </button>
          </div>
        )}
        {formStep === 3 && (
          <div>
            <h2>Documentação e Saúde</h2>
            <label>Foto do Documento Frente <span className="required">*</span>:</label>
            <input type="file" onChange={(e) => handleFileChange(e, setFrontIdPhoto)} required />
            {errors.frontIdPhoto && <span className="error">{errors.frontIdPhoto}</span>}
            <label>Foto do Documento Verso <span className="required">*</span>:</label>
            <input type="file" onChange={(e) => handleFileChange(e, setBackIdPhoto)} required />
 {errors.backIdPhoto && <span className="error">{errors.backIdPhoto}</span>}
            <label>Foto do Atleta <span className="required">*</span>:</label>
            <input type="file" onChange={(e) => handleFileChange(e, setAthletePhoto)} required />
            {errors.athletePhoto && <span className="error">{errors.athletePhoto}</span>}
            <label>Alergias Alimentares:</label>
            <input type="text" name="foodAllergies" value={athlete.foodAllergies} onChange={handleChange} />
            <button type="submit">Enviar</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AthleteForm;