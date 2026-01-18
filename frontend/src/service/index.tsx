import axios from "axios";
import type { LoginInterface } from "../interface/ILogin";
import type { UsersInterface } from "../interface/IUser";
import type { CalendarInterface } from "../interface/ICalendar";
import type { ProductInterface } from "../interface/IProduct";
import type { ProfileInterface } from "../interface/IProfile";

const apiUrl = "http://localhost:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("token_type");
  return {
    "Authorization": `${tokenType} ${token}`,
    "Content-Type": "application/json",
  };
}

const requestOptions = {
  headers: getAuthHeaders(),
};

export const AddLogin = async (data: LoginInterface) => {
  try {
    const res = await axios.post(`${apiUrl}/login`, data, requestOptions);
    return res;
  } catch (e: any) {
    return e.response;
  }
};

export const ListUsers = async (): Promise<UsersInterface[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/users`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching users:", error.response?.data || error.message);
    return null;
  }
};

export const SignupUser = async (
  input: SignupInput
): Promise<UsersInterface | false> => {
  try {
    const response = await axios.post(
      `${apiUrl}/signup`,
      input,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error: any) {
    console.error("Signup error:", error.response?.data || error.message);
    return false;
  }
};

export interface SignupInput {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone?: string;
  Password: string;
  Profile?: string;
  PositionID: number;
}

export const GetUserDataByUserID = async (
  id: number | string
): Promise<UsersInterface | false> => {
  try {
    const response = await axios.get(`${apiUrl}/user/${id}`, {
      headers: getAuthHeaders(),
    });

    console.log("Response from API:", response.data);
    return response.data.user;
  } catch (error: any) {
    console.error(
      "Error fetching User data:",
      error.response?.data || error.message
    );
    return false;
  }
};

export const UpdateUserByID = async (
  EmployeeID: number,
  data: Partial<UsersInterface>
): Promise<UsersInterface | null> => {
  try {
    const response = await axios.patch(
      `${apiUrl}/update-user/${EmployeeID}`,
      data,
      {
        headers: {
          ...getAuthHeaders(),
        },
      }
    );

    if (response.status === 200) {
      // ถ้ากลับมาเป็น { user: ... } ให้ใช้ response.data.user
      return response.data.user || response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    return null;
  }
};

export const CreateCalendar = async (
  calendarData: CalendarInterface
): Promise<{ message: string; calendar: CalendarInterface } | null> => {
  try {
    const response = await axios.post(`${apiUrl}/create-calendar`, calendarData, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error creating calendar:", error.response?.data || error.message);
    return null;
  }
};


export const ListCalendars = async (): Promise<CalendarInterface[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/calendars`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching calendars:", error.response?.data || error.message);
    return null;
  }
};

export const UpdateCalendar = async (
  id: number,
  calendarData: CalendarInterface
): Promise<{ message: string; calendar: CalendarInterface } | null> => {
  try {
    const response = await axios.put(`${apiUrl}/update-calendar/${id}`, calendarData, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error updating calendar:", error.response?.data || error.message);
    return null;
  }
};

export const DeleteCalendar = async (
  id: number
): Promise<{ message: string } | null> => {
  try {
    const response = await axios.delete(`${apiUrl}/delete-calendar/${id}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error deleting calendar:", error.response?.data || error.message);
    return null;
  }
};

export const ListProducts = async (): Promise<ProductInterface[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/products`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching products:", error.response?.data || error.message);
    return null;
  }
};

export const CreateProduct = async (
  payload: ProductInterface
): Promise<ProductInterface | null> => {
  try {
    const response = await axios.post(`${apiUrl}/create-products`, payload, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error creating product:", error.response?.data || error.message);
    return null;
  }
};

export const UpdateProductByID = async (
  productID: number,
  updatedData: Partial<ProductInterface>
): Promise<ProductInterface | null> => {
  try {
    const response = await axios.patch(`${apiUrl}/update-product/${productID}`, updatedData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      console.error("Unexpected response status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error updating product:", error.response?.data || error.message);
    return null;
  }
};

export const DeleteProductByID = async (
  productID: number
): Promise<{ message: string; productID: number } | null> => {
  try {
    const response = await axios.delete(`${apiUrl}/delete-product/${productID}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected response status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error deleting product:", error.response?.data || error.message);
    return null;
  }
};


// Profile Service Example

// ✅ List Profile
export const ListProfile = async (): Promise<ProfileInterface[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/profiles`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching profiles:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Create Profile
export const CreateProfile = async (
  data: ProfileInterface
): Promise<ProfileInterface | null> => {
  try {
    const response = await axios.post(`${apiUrl}/create-profiles`, data, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error creating profile:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Update Profile
export const UpdateProfileByID = async (
  id: number,
  data: ProfileInterface
): Promise<ProfileInterface | null> => {
  try {
    const response = await axios.put(`${apiUrl}/update-profiles/${id}`, data, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status:", response.status);
      return null;
    }
  } catch (error: any) {
    console.error("Error updating profile:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Delete Profile
export const DeleteProfileByID = async (id: number): Promise<boolean> => {
  try {
    const response = await axios.delete(`${apiUrl}/delete-profiles/${id}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });

    return response.status === 200;
  } catch (error: any) {
    console.error("Error deleting profile:", error.response?.data || error.message);
    return false;
  }
};
