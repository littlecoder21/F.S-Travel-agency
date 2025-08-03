import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const SettingsContext = createContext();

const initialState = {
  settings: null,
  loading: true,
  error: null
};

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'SETTINGS_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'SETTINGS_SUCCESS':
      return {
        ...state,
        settings: action.payload,
        loading: false,
        error: null
      };
    case 'SETTINGS_FAILURE':
      return {
        ...state,
        settings: null,
        loading: false,
        error: action.payload
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const { i18n } = useTranslation();

  // Load settings on app start
  useEffect(() => {
    loadSettings();
  }, []);

  // Update language when settings change
  useEffect(() => {
    if (state.settings?.languages?.default) {
      i18n.changeLanguage(state.settings.languages.default);
    }
  }, [state.settings, i18n]);

  const loadSettings = async () => {
    try {
      dispatch({ type: 'SETTINGS_LOADING' });
      const response = await api.get('/settings/public');
      dispatch({ type: 'SETTINGS_SUCCESS', payload: response.data });
    } catch (error) {
      console.error('Failed to load settings:', error);
      dispatch({ 
        type: 'SETTINGS_FAILURE', 
        payload: 'Failed to load website settings' 
      });
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const response = await api.put('/admin/settings', newSettings);
      dispatch({ type: 'UPDATE_SETTINGS', payload: response.data.settings });
      return { success: true };
    } catch (error) {
      console.error('Failed to update settings:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update settings' 
      };
    }
  };

  const toggleFeature = async (feature, enabled) => {
    try {
      const response = await api.post('/admin/toggle-feature', { feature, enabled });
      dispatch({ type: 'UPDATE_SETTINGS', payload: response.data.settings });
      return { success: true };
    } catch (error) {
      console.error('Failed to toggle feature:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to toggle feature' 
      };
    }
  };

  const isFeatureEnabled = (featurePath) => {
    if (!state.settings?.features) return false;
    
    const path = featurePath.split('.');
    let current = state.settings.features;
    
    for (const key of path) {
      if (current[key] === undefined) return false;
      current = current[key];
    }
    
    return current === true;
  };

  const getSupportedLanguages = () => {
    return state.settings?.languages?.supported?.filter(lang => lang.enabled) || [];
  };

  const getSupportedCurrencies = () => {
    return state.settings?.currencies?.supported?.filter(curr => curr.enabled) || [];
  };

  const getDefaultLanguage = () => {
    return state.settings?.languages?.default || 'en';
  };

  const getDefaultCurrency = () => {
    return state.settings?.currencies?.default || 'USD';
  };

  const getWebsiteInfo = () => {
    return state.settings?.website || {};
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    settings: state.settings,
    loading: state.loading,
    error: state.error,
    loadSettings,
    updateSettings,
    toggleFeature,
    isFeatureEnabled,
    getSupportedLanguages,
    getSupportedCurrencies,
    getDefaultLanguage,
    getDefaultCurrency,
    getWebsiteInfo,
    clearError
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};