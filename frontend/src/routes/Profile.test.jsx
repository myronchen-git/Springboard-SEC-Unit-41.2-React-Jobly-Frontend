import { act, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import JoblyApi from '../../../api';
import { userData } from '../_testCommon.js';
import Profile from './Profile.jsx';

// ==================================================

vi.mock(import('../../../api'), () => {
  const MockJoblyApi = vi.fn();
  MockJoblyApi.patchUser = vi.fn();

  return {
    default: MockJoblyApi,
  };
});

// ==================================================

describe('Profile', () => {
  const mockSetUser = vi.fn();

  const user = { ...userData };
  delete user.applications;
  Object.freeze(user);

  const updatedData = Object.freeze({
    firstName: 'Updated First',
    lastName: 'Updated Last',
    email: 'updated.email@email.com',
  });

  const updatedUser = Object.assign({}, user, updatedData);

  beforeEach(() => {
    JoblyApi.patchUser.mockReset();
    mockSetUser.mockReset();

    JoblyApi.patchUser.mockResolvedValue(updatedUser);
  });

  it('renders.', async () => {
    render(<Profile user={user} setUser={mockSetUser} />);
  });

  it('matches snapshot.', async () => {
    const { asFragment } = render(
      <Profile user={user} setUser={mockSetUser} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('can update form data.', () => {
    // Arrange
    const { container, getByLabelText } = render(
      <Profile user={user} setUser={mockSetUser} />
    );

    const firstNameInput = getByLabelText('First Name');
    const lastNameInput = getByLabelText('Last Name');
    const emailInput = getByLabelText('Email');

    // Act
    fireEvent.change(firstNameInput, {
      target: { value: updatedData.firstName },
    });
    fireEvent.change(lastNameInput, {
      target: { value: updatedData.lastName },
    });
    fireEvent.change(emailInput, { target: { value: updatedData.email } });

    // Assert
    expect(firstNameInput).toHaveValue(updatedData.firstName);
    expect(lastNameInput).toHaveValue(updatedData.lastName);
    expect(emailInput).toHaveValue(updatedData.email);

    const feedbackElement = container.querySelector('.Profile__feedback');
    expect(feedbackElement).not.toBeInTheDocument();

    expect(mockSetUser).not.toHaveBeenCalled();
  });

  it('can submit form data.', async () => {
    // Arrange
    const { getByLabelText, getByText } = render(
      <Profile user={user} setUser={mockSetUser} />
    );

    fireEvent.change(getByLabelText('First Name'), {
      target: { value: updatedData.firstName },
    });
    fireEvent.change(getByLabelText('Last Name'), {
      target: { value: updatedData.lastName },
    });
    fireEvent.change(getByLabelText('Email'), {
      target: { value: updatedData.email },
    });

    // Act
    await act(async () => fireEvent.click(getByText('Submit')));

    // Assert
    expect(getByText('Profile Updated')).toBeVisible();

    expect(JoblyApi.patchUser).toHaveBeenCalledOnce();
    expect(JoblyApi.patchUser).toHaveBeenCalledWith(user.username, updatedData);
    expect(mockSetUser).toHaveBeenCalledOnce();
    expect(mockSetUser).toHaveBeenCalledWith(updatedUser);
  });

  it(
    'displays an error message if there is an issue ' +
      'when updating profile.',
    async () => {
      // Arrange
      const errorMessage = 'error';
      JoblyApi.patchUser.mockRejectedValue([errorMessage]);

      const { getByLabelText, getByText } = render(
        <Profile user={user} setUser={mockSetUser} />
      );

      fireEvent.change(getByLabelText('First Name'), {
        target: { value: updatedData.firstName },
      });
      fireEvent.change(getByLabelText('Last Name'), {
        target: { value: updatedData.lastName },
      });
      fireEvent.change(getByLabelText('Email'), {
        target: { value: updatedData.email },
      });

      // Act
      await act(async () => fireEvent.click(getByText('Submit')));

      // Assert
      expect(getByText(errorMessage)).toBeVisible();

      expect(JoblyApi.patchUser).toHaveBeenCalledOnce();
      expect(JoblyApi.patchUser).toHaveBeenCalledWith(
        user.username,
        updatedData
      );
      expect(mockSetUser).not.toHaveBeenCalled();
    }
  );
});
