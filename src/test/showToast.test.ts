import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notifications } from '@mantine/notifications';
import { showToast } from '@/utils';

vi.mock('@mantine/notifications', () => ({
  notifications: { show: vi.fn() },
}));

describe('showToast utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders success toast with correct title, message, color and icon', () => {
    showToast({
      type: 'success',
      title: 'Added',
      message: 'Item added',
    });

    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Added',
        message: 'Item added',
        color: 'green',
        icon: expect.any(Object),
        autoClose: 4000,
      })
    );
  });

  it('renders error toast with default title when no title passed', () => {
    showToast({
      type: 'error',
      message: 'Something failed',
    });

    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Error', // Default capitalized
        message: 'Something failed',
        color: 'red',
      })
    );
  });

  it('renders warning toast with orange color', () => {
    showToast({
      type: 'warning',
      message: 'Be careful',
    });

    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        color: 'orange',
      })
    );
  });

  it('uses info toast (default type) when no type is provided', () => {
    showToast({
      message: 'Information message',
    });

    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Info', // Default generated title
        color: 'blue',
      })
    );
  });

  it('uses provided custom autoClose timeout', () => {
    showToast({
      message: 'Closing fast',
      autoClose: 1000,
    });

    expect(notifications.show).toHaveBeenCalledWith(
      expect.objectContaining({
        autoClose: 1000,
      })
    );
  });
});
