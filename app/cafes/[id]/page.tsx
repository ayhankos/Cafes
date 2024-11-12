"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useToast } from "@/hooks/use-toast";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type {
  Cafe,
  Image,
  Comment,
  User,
  Rating,
  Favorite,
  ContactInfo,
} from "@prisma/client";
import {
  Star,
  MapPin,
  Coffee,
  Heart,
  Globe,
  Globe2,
  LogIn,
  Phone,
  ArrowBigLeft,
} from "lucide-react";
import { Icon } from "@iconify/react";

interface ExtendedCafe extends Cafe {
  images: Image[];
  comments: (Comment & {
    user: User;
  })[];
  ratings: Rating[];
  favorites: Favorite[];
  contactInfos: ContactInfo[];
}

export default function CafeDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [cafe, setCafe] = useState<ExtendedCafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchCafeDetails = async () => {
      try {
        const response = await fetch(`/api/cafes/${params.id}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
          setCafe(null);
        } else {
          setCafe(data);
          // Eğer kullanıcı girişi yapılmışsa, favorileri kontrol et
          if (session?.user && data.favorites) {
            setIsFavorite(
              data.favorites.some(
                (fav: Favorite) => fav.userId === session.user.id
              )
            );
          }
          // Kullanıcının mevcut değerlendirmesini kontrol et
          if (session?.user && data.ratings) {
            const userRating = data.ratings.find(
              (r: Rating) => r.userId === session.user.id
            );
            if (userRating) {
              setRating(userRating.rating);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching cafe details:", error);
        setError("Kafe bilgileri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCafeDetails();
    }
  }, [params.id, session]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yorum yapmak için giriş yapmalısınız.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/cafes/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      });

      const data = await response.json();

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: data.error,
        });
      } else {
        toast({
          title: "Başarılı",
          description: "Yorumunuz başarıyla eklendi.",
        });
        setComment("");
        // Refresh comments
        const updatedCafe = await (
          await fetch(`/api/cafes/${params.id}`)
        ).json();
        setCafe(updatedCafe);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yorum gönderilirken bir hata oluştu.",
      });
    }
  };

  const handleRating = async (value: number) => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Değerlendirme yapmak için giriş yapmalısınız.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/cafes/${params.id}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: value }),
      });

      const data = await response.json();

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: data.error,
        });
      } else {
        toast({
          title: "Başarılı",
          description: "Değerlendirmeniz kaydedildi.",
        });
        setRating(value);
        const updatedCafe = await (
          await fetch(`/api/cafes/${params.id}`)
        ).json();
        setCafe(updatedCafe);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Değerlendirme kaydedilirken bir hata oluştu.",
      });
    }
  };

  const toggleFavorite = async () => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Favorilere eklemek için giriş yapmalısınız.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/cafes/${params.id}/favorites`, {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: data.error,
        });
      } else {
        setIsFavorite(!isFavorite);
        toast({
          title: "Başarılı",
          description: isFavorite
            ? "Favorilerden kaldırıldı."
            : "Favorilere eklendi.",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "İşlem gerçekleştirilirken bir hata oluştu.",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 mt-24">
        <Coffee className="w-16 h-16 text-[#6B4423] mb-4" />
        <h2 className="text-2xl font-semibold text-[#6B4423] mb-2 text-center">
          Bir Hata Oluştu
        </h2>
        <p className="text-lg text-[#8B5E34] text-center">{error}</p>
      </div>
    );
  }

  const averageRating = cafe.ratings.length
    ? cafe.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
      cafe.ratings.length
    : 0;

  const getContactInfo = (type: string) => {
    return cafe.contactInfos.find((info) => info.type === type)?.value;
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <ArrowBigLeft
          className="w-8 h-8 mr-2 cursor-pointer hover:scale-110 transition-transform duration-200"
          color="#6B4423"
          onClick={() => history.back()}
        />
        <h1 className="text-3xl font-bold text-[#6B4423]">{cafe.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-1" />
            <span>{averageRating.toFixed(1)}</span>
          </div>
          <Button
            variant={isFavorite ? "secondary" : "outline"}
            onClick={toggleFavorite}
            disabled={!session}
          >
            <Heart
              className={`w-5 h-5 mr-2 ${isFavorite ? "fill-current" : ""}`}
            />
            {isFavorite ? "Favorilerde" : "Favorilere Ekle"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Sol Kolon */}
        <div className="flex flex-col space-y-6">
          <Card className="flex-1">
            <div className="h-96">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={true}
                pagination={{ clickable: true }}
                slidesPerView={1}
                className="w-full h-full"
              >
                {cafe.images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <div className="h-full w-full">
                      <img
                        src={image.url}
                        alt={cafe.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Kafe Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Description */}
                {cafe.description && (
                  <div className="max-h-48 overflow-y-auto">
                    <p className="text-gray-600">{cafe.description}</p>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-[#6B4423]" />
                  <p>
                    {cafe.city}, {cafe.district}
                  </p>
                </div>

                {cafe.googleMapsUrl && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-[#6B4423]" />
                    <a
                      href={cafe.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Haritada Görüntüle
                    </a>
                  </div>
                )}

                {/* Category */}
                <div className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-[#6B4423]" />
                  <span className="px-2 py-1 bg-[#6B4423]/10 text-[#6B4423] rounded-full text-sm">
                    {cafe.category}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 border-t pt-4">
                  <h3 className="font-medium mb-2">İletişim Bilgileri</h3>
                  {/* Phone */}
                  {getContactInfo("PHONE") && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#6B4423]" />
                      <a
                        href={`tel:${getContactInfo("PHONE")}`}
                        className="hover:underline"
                      >
                        {getContactInfo("PHONE")}
                      </a>
                    </div>
                  )}

                  {/* Instagram */}
                  {getContactInfo("INSTAGRAM") && (
                    <div className="flex items-center gap-2">
                      <Icon icon="skill-icons:instagram" color="#6B4423" />
                      <a
                        href={`https://instagram.com/${getContactInfo(
                          "INSTAGRAM"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        @{getContactInfo("INSTAGRAM")}
                      </a>
                    </div>
                  )}
                  {/* Website */}
                  {getContactInfo("WEBSITE") && (
                    <div className="flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-[#6B4423]" />
                      <a
                        href={getContactInfo("WEBSITE")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Kolon */}
        <div className="flex flex-col space-y-6">
          {cafe.googleMapsEmbedUrl && (
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Konum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <iframe
                    src={cafe.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Değerlendirme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    variant={value <= rating ? "default" : "outline"}
                    onClick={() => handleRating(value)}
                    disabled={!session}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        value <= rating ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Yorumlar Bölümü */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Yorumlar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <Textarea
              placeholder={
                session
                  ? "Yorumunuzu yazın..."
                  : "Yorum yapmak için giriş yapmalısınız."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4"
              disabled={!session}
            />
            <Button type="submit" disabled={!session}>
              {!session && <LogIn className="mr-2" size={20} />}
              {session ? "Yorum Yap" : "Yorum yapmak için giriş yapın."}
            </Button>
          </form>

          {!session && (
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-500 mt-2"
            >
              <p>Giriş Yapmak İçin Tıklayınız.</p>
            </Link>
          )}

          <div className="space-y-4">
            {cafe.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <Avatar>
                  <AvatarImage src={comment.user.profileImage || undefined} />
                  <AvatarFallback>{comment.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{comment.user.name}</p>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
