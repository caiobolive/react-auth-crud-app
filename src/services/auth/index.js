import axios from '../axios';

export const authApi = async (userData) => {
  try {
    const { data } = await axios.post('/login', {
      email: userData.email,
      password: userData.password,
    });

    // A API ReqRes retorna { token: "..." } em caso de sucesso
    // Para emails válidos como: eve.holt@reqres.in e senha: cityslicka
    return {
      success: true,
      token: data.token,
      user: {
        email: userData.email,
      },
    };
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Email ou senha inválidos');
    }
    throw new Error('Erro ao fazer login. Tente novamente.');
  }
};
