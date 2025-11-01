// coupon code list

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CouponLists = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponDetails, setCouponDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const APPKEY =
    "Py9YJXgBecbbqxjRVaHarcSnJyuzhxGqJTkY6xKZRfrdXFy72HPXvFRvfEjy";

  // ✅ Fetch coupon list
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://ne-games.com/leaderBoard/api/affiliate/discountCodeList",
          {
            headers: { APPKEY },
          }
        );

        const apiData = response.data?.data || [];

        const formatted = apiData.slice(0, 8).map((user, index) => ({
          id: user.id,
          discount_code: user.discount_code || `CODE${index + 10}`,
          discount_percentage:
            user.discount_percentage || Math.floor(Math.random() * 30) + 5,
          email: user.email || "",
          business_name: user.business_name || "",
          bank_name: user.bank_name || "",
          bank_account_number: user.bank_account_number || "",
          bic_code: user.bic_code || "",
          address: user.address || "",
          city: user.city || "",
          country: user.country || "",
          post_code: user.post_code || "",
          bank_address: user.bank_address || "",
        }));

        setCoupons(formatted);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // ✅ Fetch coupon details API
  const fetchCouponDetails = async (discount_code) => {
    try {
      setDetailLoading(true);
      const res = await axios.get(
        `https://ne-games.com/leaderBoard/api/affiliate/DiscountCodeDetails`,
        {
          params: { discount_code },
          headers: { APPKEY },
        }
      );
      setCouponDetails(res.data.data);
    } catch (error) {
      console.error("Error fetching coupon details:", error);
      setCouponDetails(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // ✅ Handle show details click
  const handleShowDetails = (coupon) => {
    setSelectedCoupon(coupon);
    setCouponDetails(null);
    fetchCouponDetails(coupon.discount_code);
  };

  // 🌀 Loading UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600 text-lg">Loading coupons...</p>
      </div>
    );
  }

  // 😢 No Data
  if (coupons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <p className="text-gray-600 text-lg">No coupons found.</p>
      </div>
    );
  }

  // 🎁 Coupon Cards
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
        Created Coupons
      </h1>

      <ScrollArea className="h-[80vh] w-full max-w-6xl mx-auto space-y-6">
        {coupons.map((coupon, index) => (
          <Card
            key={index}
            className="shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 rounded-2xl overflow-hidden bg-white"
          >
            <CardHeader className="bg-gradient-to-r from-pink-800 to-purple-500 text-white p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  {coupon.discount_code || "N/A"}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-white text-blue-700 font-semibold"
                >
                  {coupon.discount_percentage}% OFF
                </Badge>
              </div>
              <p className="text-sm opacity-90 mt-1">
                {coupon.email || "No email provided"}
              </p>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-4">
              {/* ✅ Bank & Address Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Business / Payee Name
                  </h3>
                  <p className="text-gray-800">{coupon.business_name}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Bank Name
                  </h3>
                  <p className="text-gray-800">{coupon.bank_name}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Account Number / IBAN
                  </h3>
                  <p className="text-gray-800">
                    {coupon.bank_account_number || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    BIC / SWIFT Code
                  </h3>
                  <p className="text-gray-800">{coupon.bic_code || "N/A"}</p>
                </div>

                <div className="md:col-span-2">
                  <Separator className="my-2" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Address</h3>
                  <p className="text-gray-800">
                    {coupon.address}, {coupon.city}, {coupon.country} -{" "}
                    {coupon.post_code}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Bank Address
                  </h3>
                  <p className="text-gray-800">{coupon.bank_address}</p>
                </div>
              </div>

              {/* ✅ Details Modal */}
              <div className="flex justify-end mt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-700 hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleShowDetails(coupon)}
                    >
                      Show Details
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-3xl max-w-sm w-full rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-blue-800">
                        Coupon Details
                      </DialogTitle>
                    </DialogHeader>

                    {detailLoading ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      </div>
                    ) : couponDetails ? (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p>
                            <strong>Discount Code:</strong>{" "}
                            {couponDetails.discount_code || coupon.discount_code}
                          </p>
                          <p>
                            <strong>Discount %:</strong>{" "}
                            {couponDetails.discount_percentage ||
                              coupon.discount_percentage}
                          </p>
                        </div>

                        <Separator />

                        <h3 className="text-lg font-semibold text-gray-800">
                          Total Apply {couponDetails.used_by?.length || 0}
                        </h3>

                        <div className="max-h-[300px] overflow-y-auto border rounded-lg">
                          <table className="min-w-full text-sm border-collapse">
                            <thead className="bg-gray-100 sticky top-0">
                              <tr>
                                <th className="p-2 text-left border-b">Name</th>
                                <th className="p-2 text-left border-b">Email</th>
                                <th className="p-2 text-left border-b">Type</th>
                                <th className="p-2 text-left border-b">
                                  Amount
                                </th>
                                <th className="p-2 text-left border-b">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {couponDetails.used_by?.map((user, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                  <td className="p-2 border-b">{user.name}</td>
                                  <td className="p-2 border-b">{user.email}</td>
                                  <td className="p-2 border-b">
                                    {user.subscription_type}
                                  </td>
                                  <td className="p-2 border-b">{user.amount}</td>
                                  <td className="p-2 border-b">
                                    {user.transaction_date}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        No details available.
                      </p>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
};

export default CouponLists;
