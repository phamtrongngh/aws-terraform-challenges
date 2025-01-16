import { Configuration, AuthApi, TasksApi, UsersApi } from "./generated";

export * from "./generated";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

class ApiClientFactory {
  private createConfiguaraion(accessToken: string | null) {
    return new Configuration({
      basePath: BASE_URL,
      fetchApi: async (url: string, options = {}) => {
        const response = await fetch(url, options);

        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }

        return response;
      },
      accessToken: accessToken || undefined,
    });
  }

  createAuthClient(accessToken: string | null) {
    return new AuthApi(this.createConfiguaraion(accessToken));
  }

  createTasksClient(accessToken: string | null) {
    return new TasksApi(this.createConfiguaraion(accessToken));
  }

  createUsersClient(accessToken: string | null) {
    return new UsersApi(this.createConfiguaraion(accessToken));
  }
}

export const apiClient = new ApiClientFactory();
