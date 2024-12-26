import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

type ChiTietPhieuDat = {
  ten_khach_hang: string;
  kieu_toc: KieuToc;
  dich_vu: DichVu[];
};

type DichVu = {
  id_dich_vu: number;
  ten_dich_vu: string;
  phi_dich_vu: number;
};
type KieuToc = {
  id_kieu_toc: number;
  ten_kieu_toc: string;
  gia: number;
  hinh_anh: string;
};
type Booking = {
  id_tai_khoan: string;
  ngay_hen: Date;
  gio_hen: string;
  phuong_thuc_thanh_toan: string;
  tong_tien: number;
  thoi_gian_dat: Date;
  chi_tiet_phieu_dat: ChiTietPhieuDat[];
};

type BookingContextType = {
  booking: Booking | null;
  setBooking: (booking: Booking | null) => void;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [booking, setBooking] = useState<Booking | null>(null);
  
  const tomorow = new Date();
  tomorow.setDate(tomorow.getDate() + 1);
  // Đồng bộ booking khi user thay đổi
  useEffect(() => {
    if (user) {
      setBooking({
        id_tai_khoan: user.id,
        ngay_hen: tomorow,
        gio_hen: '',
        phuong_thuc_thanh_toan: 'Tiền mặt',
        tong_tien: 0,
        thoi_gian_dat: new Date(),
        chi_tiet_phieu_dat: [
          {
            ten_khach_hang: user.ho_ten,
            kieu_toc: {
              id_kieu_toc: 0,
              ten_kieu_toc: '',
              gia: 0,
              hinh_anh: '',
            },
            dich_vu: [
              {
                id_dich_vu: 0,
                ten_dich_vu: '',
                phi_dich_vu: 0,
              },
            ],
          },
        ],
      });
    } else {
      setBooking(null); // Reset nếu user không tồn tại
    }
  }, [user]);

  return (
    <BookingContext.Provider value={{ booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
};


export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
