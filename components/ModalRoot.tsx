import React from 'react';
import { useModal } from '../context/ModalContext';
import { JobFormModal, JobDetailsModal } from './modals/JobModals';
import { ApplyModal, CreateAlertModal, ProposalTemplateModal } from './modals/CandidateModals';
import { PlanPaymentModal, VerificationModal } from './modals/CompanyModals';
import { ModerateJobModal } from './modals/AdminModals';
import { EditProfileModal } from './modals/ProfileModals';
import { ConfirmationModal, FeedbackModal } from './modals/SystemModals';

export const ModalRoot = () => {
  const { modalType } = useModal();

  if (!modalType) return null;

  switch (modalType) {
    // Jobs
    case 'CREATE_JOB':
    case 'EDIT_JOB':
      return <JobFormModal />;
    case 'JOB_DETAILS':
      return <JobDetailsModal />;
    
    // Candidate
    case 'APPLY_JOB':
      return <ApplyModal />;
    case 'CREATE_ALERT':
      return <CreateAlertModal />;
    case 'PROPOSAL_TEMPLATE':
      return <ProposalTemplateModal />;

    // Company
    case 'PLAN_PAYMENT':
      return <PlanPaymentModal />;
    case 'VERIFY_COMPANY':
      return <VerificationModal />;

    // Admin
    case 'MODERATE_JOB':
        return <ModerateJobModal />;
    
    // User
    case 'EDIT_PROFILE':
        return <EditProfileModal />;
    
    // System
    case 'CONFIRMATION':
      return <ConfirmationModal />;
    case 'FEEDBACK':
        return <FeedbackModal />;

    default:
      return null;
  }
};