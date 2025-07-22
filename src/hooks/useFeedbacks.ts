"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/config/firebase"
import type { Feedback } from "@/types/feedback"

export const useFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const feedbacksRef = collection(db, "feedbacks")
      const q = query(feedbacksRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const feedbacksData: Feedback[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Feedback[]

      setFeedbacks(feedbacksData)
      setError(null)
    } catch (err) {
      setError("Erro ao carregar feedbacks")
      console.error("Error fetching feedbacks:", err)
      // Mock data for development
      setFeedbacks([
        {
          id: "1",
          userName: "João Silva",
          rating: 5,
          comment: "Excelente serviço! Muito satisfeito com o atendimento.",
          createdAt: new Date("2024-01-15"),
        },
        {
          id: "2",
          userName: "Maria Santos",
          rating: 4,
          comment: "Bom produto, mas poderia melhorar a entrega.",
          createdAt: new Date("2024-01-14"),
        },
        {
          id: "3",
          userName: "Pedro Costa",
          rating: 3,
          comment: "Produto mediano, atendeu às expectativas básicas.",
          createdAt: new Date("2024-01-13"),
        },
        {
          id: "4",
          userName: "Ana Oliveira",
          rating: 5,
          comment: "Perfeito! Recomendo para todos.",
          createdAt: new Date("2024-01-12"),
        },
        {
          id: "5",
          userName: "Carlos Ferreira",
          rating: 2,
          comment: "Não gostei muito, esperava mais qualidade.",
          createdAt: new Date("2024-01-11"),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  return {
    feedbacks,
    loading,
    error,
    refetch: fetchFeedbacks,
  }
}
